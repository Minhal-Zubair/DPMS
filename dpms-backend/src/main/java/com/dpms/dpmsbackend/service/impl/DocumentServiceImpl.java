package com.dpms.dpmsbackend.service.impl;


import com.dpms.dpmsbackend.entity.Document;
import com.dpms.dpmsbackend.repository.DocumentRepository;
import com.dpms.dpmsbackend.service.DocumentService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;



@Service
public class DocumentServiceImpl
        implements DocumentService {


    private final DocumentRepository repository;



    public DocumentServiceImpl(
            DocumentRepository repository
    ){
        this.repository=repository;
    }


    @Override
    public Document getDocument(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    @Override
    public void uploadDocument(
            Long applicationId,
            Long userId,
            Integer documentTypeId,
            MultipartFile file
    ){

        try {

//            byte[] base64Bytes = Base64.getEncoder().encode(file.getBytes());

            Document doc=new Document();


            doc.setApplicationId(applicationId);

            doc.setUploadedBy(userId);

            doc.setDocumentTypeId(documentTypeId);


            doc.setOriginalName(
                    file.getOriginalFilename()
            );

            byte[] bytes = file.getBytes();

            System.out.println("======================");
            System.out.println("FILE NAME : " + file.getOriginalFilename());
            System.out.println("BYTE SIZE : " + bytes.length);
            System.out.println("======================");

            doc.setFileData(bytes);

            doc.setFileSize(
                    file.getSize()
            );


            Document saved = repository.save(doc);

            System.out.println(
                    "SAVED DOCUMENT ID : "
                            + saved.getId()
            );

        }
        catch(Exception e){

            e.printStackTrace();

            throw new RuntimeException(e);

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
    }

}