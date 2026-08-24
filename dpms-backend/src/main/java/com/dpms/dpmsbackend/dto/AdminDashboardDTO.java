package com.dpms.dpmsbackend.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AdminDashboardDTO {

    private long totalUsers;
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;

    private List<AdminRecentApplicationDTO> recentApplications;
    private List<AdminActivityDTO> recentActivities;

    // Chart data
    private List<Map<String, Object>> monthlyApplications;  // [{month, count}]
    private List<Map<String, Object>> statusBreakdown;       // [{status, count}]
    private List<Map<String, Object>> productBreakdown;      // [{product, count}]
}