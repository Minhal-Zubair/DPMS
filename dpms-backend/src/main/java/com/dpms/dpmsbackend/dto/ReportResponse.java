package com.dpms.dpmsbackend.dto;
import lombok.Data;
@Data
public class ReportResponse {
    // USERS
    private long totalUsers;
    private long activeUsers;
    private long disabledUsers;
    private long lockedUsers;
    // APPLICATIONS
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;
    // SYSTEM
    private long totalLogs;
}