package com.dpms.dpmsbackend.dto;

import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.entity.Notification;

import java.util.List;

public class DashboardResponse {

    // User
    private String firstName;

    // Statistics
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;

    // Recent Data
    private List<Application> recentApplications;
    private List<Notification> recentNotifications;

    public DashboardResponse() {
    }

    // ==========================
    // Getters & Setters
    // ==========================

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public long getApprovedApplications() {
        return approvedApplications;
    }

    public void setApprovedApplications(long approvedApplications) {
        this.approvedApplications = approvedApplications;
    }

    public long getRejectedApplications() {
        return rejectedApplications;
    }

    public void setRejectedApplications(long rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }

    public List<Application> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(List<Application> recentApplications) {
        this.recentApplications = recentApplications;
    }

    public List<Notification> getRecentNotifications() {
        return recentNotifications;
    }

    public void setRecentNotifications(List<Notification> recentNotifications) {
        this.recentNotifications = recentNotifications;
    }
}