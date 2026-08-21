package com.dpms.dpmsbackend.dto;
import lombok.Data;
@Data
public class ReportSummaryDTO {
    // Users
    private long totalUsers;
    private long activeUsers;
    private long disabledUsers;
    private long lockedUsers;
    // Applications
    private long totalApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long pendingApplications;
    // Other
    private long totalNotifications;
    private long totalAuditLogs;
}