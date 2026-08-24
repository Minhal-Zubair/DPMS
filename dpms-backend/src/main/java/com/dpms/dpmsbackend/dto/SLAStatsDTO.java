package com.dpms.dpmsbackend.dto;

import lombok.Data;

@Data
public class SLAStatsDTO {
    private long totalActive;
    private long onTrack;
    private long atRisk;
    private long overdue;
    private long completed;
    private double averageProcessingDays;
    private double slaComplianceRate;
}