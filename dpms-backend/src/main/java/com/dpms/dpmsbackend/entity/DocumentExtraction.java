package com.dpms.dpmsbackend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_extractions")
@Data
public class DocumentExtraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @Column(name = "application_id")
    private Long applicationId;

    @Column(name = "detected_type")
    private String detectedType;

    @Column(name = "extracted_name")
    private String extractedName;

    @Column(name = "extracted_cnic")
    private String extractedCnic;

    @Column(name = "extracted_date")
    private String extractedDate;

    @Column(name = "extracted_salary")
    private String extractedSalary;

    @Column(name = "extracted_account")
    private String extractedAccount;

    @Column(name = "cnic_match")
    private Boolean cnicMatch;

    @Column(name = "mismatch_reason", length = 500)
    private String mismatchReason;

    @Column(name = "raw_extraction", columnDefinition = "TEXT")
    private String rawExtraction;

    @Column(name = "extraction_status")
    private String extractionStatus; // SUCCESS, FAILED, UNREADABLE

    @Column(name = "extracted_at")
    private LocalDateTime extractedAt;

    @PrePersist
    public void onCreate() {
        extractedAt = LocalDateTime.now();
    }
}