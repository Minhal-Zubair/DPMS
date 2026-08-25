package com.dpms.dpmsbackend.service.impl;

import com.dpms.dpmsbackend.entity.Document;
import com.dpms.dpmsbackend.repository.DocumentRepository;
import com.dpms.dpmsbackend.repository.ApplicationRepository;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.service.ActivityLogService;
import com.dpms.dpmsbackend.service.DocumentService;
import com.dpms.dpmsbackend.service.EmailService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository repository;
    private final ActivityLogService activityLogService;
    private final EmailService emailService;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public DocumentServiceImpl(
            DocumentRepository repository,
            ActivityLogService activityLogService,
            EmailService emailService,
            ApplicationRepository applicationRepository,
            UserRepository userRepository
    ){
        this.repository = repository;
        this.activityLogService = activityLogService;
        this.emailService = emailService;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }


    @Override
    public Document getDocument(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    // ── helpers ──────────────────────────────────────────────
    private String sha256(byte[] bytes) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(bytes);
            return java.util.HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Hashing failed", e);
        }
    }

    @Override
    public void uploadDocument(
            Long applicationId,
            Long userId,
            Integer documentTypeId,
            MultipartFile file
    ){
        try {
            byte[] bytes = file.getBytes();

            // 1. Quality check
            if (bytes.length < 5_000) {
                throw new RuntimeException(
                    "File too small or corrupted (min 5KB). Upload a clear, readable document."
                );
            }
            String contentType = file.getContentType();
            if (contentType != null && contentType.startsWith("image/") && bytes.length < 30_000) {
                throw new RuntimeException(
                    "Image quality too low. Upload a higher-resolution scan (min 30KB)."
                );
            }

            // 2. Duplicate file check (same bytes)
            String hash = sha256(bytes);
            if (repository.existsByApplicationIdAndFileHash(applicationId, hash)) {
                throw new RuntimeException(
                    "This exact file has already been uploaded for this application."
                );
            }

            // 3. Duplicate slot check (same document type)
            if (repository.existsByApplicationIdAndDocumentTypeId(applicationId, documentTypeId)) {
                throw new RuntimeException(
                    "A document of this type is already uploaded. Remove it before re-uploading."
                );
            }

            // 4. Save
            Document doc = new Document();
            doc.setApplicationId(applicationId);
            doc.setUploadedBy(userId);
            doc.setDocumentTypeId(documentTypeId);
            doc.setOriginalName(file.getOriginalFilename());
            doc.setFileData(bytes);
            doc.setFileSize((long) bytes.length);
            doc.setFileHash(hash);

            System.out.println("======================" );
            System.out.println("FILE: " + file.getOriginalFilename() + " | SIZE: " + bytes.length + " | HASH: " + hash);
            System.out.println("======================");

            repository.save(doc);

            activityLogService.log(
                "DOCUMENT_UPLOADED",
                "Document uploaded: " + file.getOriginalFilename(),
                userId,
                applicationId
            );

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload document: " + e.getMessage());
        }
    }


    @Override
    public List<Document> getDocuments(Long applicationId){
        return repository.findByApplicationId(applicationId);
    }

    @Override
    public void verifyDocument(Long documentId, Boolean verified, String remarks) {
        Document doc = repository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        doc.setVerified(verified);
        doc.setRemarks(remarks);
        repository.save(doc);

        activityLogService.log(
                verified ? "DOCUMENT_VERIFIED" : "DOCUMENT_REJECTED",
                verified ? "Document verified" : "Document rejected: " + remarks,
                doc.getUploadedBy(),
                doc.getApplicationId()
        );

        // Send email to applicant
        if (doc.getApplicationId() != null) {
            applicationRepository.findById(doc.getApplicationId()).ifPresent(app -> {
                if (app.getUserId() != null) {
                    userRepository.findById(app.getUserId()).ifPresent(user -> {
                        if (user.getEmail() != null && !user.getEmail().isBlank()) {
                            String name = user.getFirstName() + " " + user.getLastName();
                            String docName = "Document #" + doc.getDocumentTypeId();
                            if (verified) {
                                emailService.sendDocumentVerifiedEmail(
                                    user.getEmail(), name, docName, app.getApplicationNumber()
                                );
                            } else {
                                emailService.sendDocumentRejectedEmail(
                                    user.getEmail(), name, docName, app.getApplicationNumber(), remarks
                                );
                            }
                        }
                    });
                }
            });
        }
    }

}