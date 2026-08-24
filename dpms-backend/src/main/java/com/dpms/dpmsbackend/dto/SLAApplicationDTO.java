package com.dpms.dpmsbackend.dto;

import lombok.Data;

@Data
public class SLAApplicationDTO {
    private Long id;
    private String applicationNumber;
    private String applicant;
    private String product;
    private String status;
    private Integer slaDays;
    private String slaDeadline;
    private long daysElapsed;
    private long daysRemaining;
    private String slaStatus; // ON_TRACK, AT_RISK, OVERDUE, COMPLETED
}