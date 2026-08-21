package com.dpms.dpmsbackend.service.impl;

import com.dpms.dpmsbackend.dto.DashboardResponse;
import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.entity.Notification;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.repository.ApplicationRepository;
import com.dpms.dpmsbackend.repository.NotificationRepository;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.service.DashboardService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;

    public DashboardServiceImpl(
            UserRepository userRepository,
            ApplicationRepository applicationRepository,
            NotificationRepository notificationRepository
    ) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public DashboardResponse getDashboard(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // CHECK ACCOUNT STATUS
        if(Boolean.FALSE.equals(user.getEnabled())){
            throw new RuntimeException(
                    "Your account is disabled. Please contact administrator."
            );
        }
        if(Boolean.TRUE.equals(user.getAccountLocked())){
            throw new RuntimeException(
                    "Your account is locked. Please contact administrator."
            );
        }

        DashboardResponse response = new DashboardResponse();

        // ============================
        // User
        // ============================

        response.setFirstName(user.getFirstName());

        // ============================
        // Statistics
        // ============================

        response.setTotalApplications(
                applicationRepository.countByUserId(userId)
        );

        response.setPendingApplications(
                applicationRepository.countByUserIdAndStatus(
                        userId,
                        Application.Status.Under_Review
                )
        );

        response.setApprovedApplications(
                applicationRepository.countByUserIdAndStatus(
                        userId,
                        Application.Status.Approved
                )
        );

        response.setRejectedApplications(
                applicationRepository.countByUserIdAndStatus(
                        userId,
                        Application.Status.Rejected
                )
        );
        // ============================
        // Recent Applications
        // ============================

        List<Application> recentApplications =
                applicationRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);

        response.setRecentApplications(recentApplications);

        // ============================
        // Recent Notifications
        // ============================

        List<Notification> recentNotifications =
                notificationRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);

        response.setRecentNotifications(recentNotifications);

        return response;
    }

}