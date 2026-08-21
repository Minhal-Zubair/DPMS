package com.dpms.dpmsbackend.dto;

import lombok.Data;

import java.util.List;

@Data
public class AdminDashboardDTO {

    private long totalUsers;

    private long totalApplications;

    private long pendingApplications;

    private long approvedApplications;

    private long rejectedApplications;

    private List<AdminRecentApplicationDTO> recentApplications;

    // ADD THIS
    private List<AdminActivityDTO> recentActivities;

}