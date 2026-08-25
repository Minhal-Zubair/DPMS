package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.entity.Document;
import com.dpms.dpmsbackend.entity.ProductDocumentType;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class ReviewService {

    private final ApplicationRepository applicationRepository;
    private final DocumentRepository documentRepository;
    private final DocumentExtractionRepository extractionRepository;
    private final ProductDocumentTypeRepository productDocTypeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;
    private final ApplicationLogService applicationLogService;

    public ReviewService(
            ApplicationRepository applicationRepository,
            DocumentRepository documentRepository,
            DocumentExtractionRepository extractionRepository,
            ProductDocumentTypeRepository productDocTypeRepository,
            UserRepository userRepository,
            EmailService emailService,
            ActivityLogService activityLogService,
            ApplicationLogService applicationLogService
    ) {
        this.applicationRepository = applicationRepository;
        this.documentRepository = documentRepository;
        this.extractionRepository = extractionRepository;
        this.productDocTypeRepository = productDocTypeRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.activityLogService = activityLogService;
        this.applicationLogService = applicationLogService;
    }

    // ── Risk Score Calculation ──────────────────────────────────
    public Map<String, Object> calculateRisk(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        List<Document> documents = documentRepository.findByApplicationId(applicationId);
        List<String> riskFactors = new ArrayList<>();
        int score = 0;

        // 1. Overdue SLA
        if (app.getCreatedAt() != null) {
            long days = ChronoUnit.DAYS.between(app.getCreatedAt(), LocalDateTime.now());
            if (days > 10) { score += 30; riskFactors.add("Severely overdue (" + days + " days)"); }
            else if (days > 5) { score += 15; riskFactors.add("Overdue (" + days + " days)"); }
        }

        // 2. Missing required documents
        if (app.getProductId() != null) {
            List<ProductDocumentType> required = productDocTypeRepository
                    .findByProductId(app.getProductId())
                    .stream().filter(p -> Boolean.TRUE.equals(p.getIsRequired())).toList();
            long uploaded = documents.size();
            long missing = Math.max(0, required.size() - uploaded);
            if (missing > 0) {
                score += (int)(missing * 20);
                riskFactors.add(missing + " required document(s) missing");
            }
        }

        // 3. Rejected documents
        long rejected = documents.stream()
                .filter(d -> Boolean.FALSE.equals(d.getVerified())).count();
        if (rejected > 0) {
            score += (int)(rejected * 15);
            riskFactors.add(rejected + " document(s) rejected");
        }

        // 4. CNIC mismatch from AI extraction
        boolean hasMismatch = extractionRepository
                .findByApplicationId(applicationId)
                .stream().anyMatch(e -> Boolean.FALSE.equals(e.getCnicMatch()));
        if (hasMismatch) { score += 35; riskFactors.add("CNIC mismatch detected by AI"); }

        // 5. All docs unverified
        long pending = documents.stream()
                .filter(d -> d.getVerified() == null).count();
        if (!documents.isEmpty() && pending == documents.size()) {
            score += 10;
            riskFactors.add("No documents verified yet");
        }

        // Cap at 100
        score = Math.min(score, 100);

        // Save risk score
        app.setRiskScore(score);
        applicationRepository.save(app);

        String level = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("riskScore", score);
        result.put("riskLevel", level);
        result.put("riskFactors", riskFactors);
        return result;
    }

    // ── Save Reviewer Notes ─────────────────────────────────────
    public void saveReviewerNotes(Long applicationId, String notes) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setReviewerNotes(notes);
        applicationRepository.save(app);
    }

    // ── Request Correction ──────────────────────────────────────
    public void requestCorrection(Long applicationId, String instructions) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setCorrectionRequest(instructions);
        app.setCorrectionRequestedAt(LocalDateTime.now());
        app.setStatus(Application.Status.Correction_Required);
        applicationRepository.save(app);

        applicationLogService.saveLog(
                applicationId, null,
                "CORRECTION_REQUESTED",
                "Correction requested: " + instructions
        );

        activityLogService.log(
                "CORRECTION_REQUESTED",
                "Correction requested for " + app.getApplicationNumber(),
                null, applicationId
        );

        // Email the applicant
        if (app.getUserId() != null) {
            userRepository.findById(app.getUserId()).ifPresent(user -> {
                if (user.getEmail() != null) {
                    String name = user.getFirstName() + " " + user.getLastName();
                    emailService.sendEmail(
                        user.getEmail(),
                        "Correction Required — " + app.getApplicationNumber(),
                        buildCorrectionEmail(name, app.getApplicationNumber(), instructions)
                    );
                }
            });
        }
    }

    private String buildCorrectionEmail(String name, String appNo, String instructions) {
        return "<html><body style='font-family:Arial,sans-serif;background:#f1f5f9;padding:40px;'>"
            + "<div style='max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;'>"
            + "<div style='background:#d97706;padding:28px 36px;'>"
            + "<h1 style='margin:0;color:#fff;'>DPMS</h1>"
            + "<p style='margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;'>Document Processing Management System</p>"
            + "</div>"
            + "<div style='padding:36px;'>"
            + "<h2 style='color:#1e293b;'>Correction Required</h2>"
            + "<p style='color:#475569;'>Dear " + name + ",</p>"
            + "<p style='color:#475569;'>Your application <b>" + appNo + "</b> requires correction before it can be processed.</p>"
            + "<div style='background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:16px 0;'>"
            + "<b style='color:#92400e;'>Instructions from Reviewer:</b>"
            + "<p style='color:#78350f;margin:8px 0 0;'>" + instructions + "</p>"
            + "</div>"
            + "<p style='color:#64748b;'>Please log in to the DPMS portal to make the required corrections and resubmit.</p>"
            + "</div>"
            + "<div style='background:#f8fafc;padding:16px 36px;border-top:1px solid #e2e8f0;text-align:center;'>"
            + "<p style='color:#94a3b8;font-size:12px;'>© 2026 DPMS · Automated email, do not reply.</p>"
            + "</div></div></body></html>";
    }
}