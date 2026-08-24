package com.dpms.dpmsbackend.dto;

import lombok.Data;

@Data
public class ExtractionResultDTO {
    private Long documentId;
    private String detectedType;
    private String extractedName;
    private String extractedCnic;
    private String extractedDate;
    private String extractedSalary;
    private String extractedAccount;
    private Boolean cnicMatch;
    private String mismatchReason;
    private String extractionStatus;
    private String rawExtraction;
}