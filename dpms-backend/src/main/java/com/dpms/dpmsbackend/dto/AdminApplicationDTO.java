package com.dpms.dpmsbackend.dto;
import lombok.Data;
@Data
public class AdminApplicationDTO {
    private Long id;
    private String applicationNumber;
    private String applicant;
    private String cnic;
    private String productionDate;
    private String product;
    private String submittedDate;
    private String status;
    private Long daysInProgress;
    private Boolean overdue;
}