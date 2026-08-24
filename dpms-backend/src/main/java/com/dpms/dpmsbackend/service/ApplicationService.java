package com.dpms.dpmsbackend.service;
import com.dpms.dpmsbackend.dto.AdminApplicationDTO;
import com.dpms.dpmsbackend.dto.ApplicationRequest;
import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.dto.ApplicationDetailsDTO;
import java.util.List;
public interface ApplicationService {
    Application createApplication(
            ApplicationRequest request,
            Long userId
    );

    Application saveDraft(
            ApplicationRequest request,
            Long userId
    );
    List<Application> getUserApplications(
            Long userId
    );
    Application updateApplication(
            Long id,
            ApplicationRequest request
    );
    long getTotalApplications();
    long getApprovedApplications();
    long getRejectedApplications();
    long getPendingApplications();
    List<Application> getRecentApplications();
    // ==========================
    // Admin Review
    // ==========================
    List<AdminApplicationDTO> getAllApplications();
    ApplicationDetailsDTO getApplication(Long id);
    void updateStatus(Long applicationId, String status);
}