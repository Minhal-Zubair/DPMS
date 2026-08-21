package com.dpms.dpmsbackend.service.impl;
import com.dpms.dpmsbackend.dto.ReportSummaryDTO;
import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.repository.ApplicationLogRepository;
import com.dpms.dpmsbackend.repository.ApplicationRepository;
import com.dpms.dpmsbackend.repository.NotificationRepository;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.service.ReportService;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ReportServiceImpl implements ReportService {
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    private final ApplicationLogRepository applicationLogRepository;
    public ReportServiceImpl(
            UserRepository userRepository,
            ApplicationRepository applicationRepository,
            NotificationRepository notificationRepository,
            ApplicationLogRepository applicationLogRepository
    ) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.notificationRepository = notificationRepository;
        this.applicationLogRepository = applicationLogRepository;
    }
    @Override
    public ReportSummaryDTO getSummary() {
        ReportSummaryDTO dto = new ReportSummaryDTO();
        // ================= USERS =================
        dto.setTotalUsers(userRepository.count());
        dto.setActiveUsers(userRepository.countByEnabledTrue());
        dto.setDisabledUsers(userRepository.countByEnabledFalse());
        dto.setLockedUsers(userRepository.countByAccountLockedTrue());
        // ================= APPLICATIONS =================
        dto.setTotalApplications(applicationRepository.count());
        dto.setApprovedApplications(
                applicationRepository.countByStatus(Application.Status.Approved)
        );
        dto.setRejectedApplications(
                applicationRepository.countByStatus(Application.Status.Rejected)
        );
        dto.setPendingApplications(
                applicationRepository.countByStatusIn(
                        List.of(
                                Application.Status.Submitted,
                                Application.Status.Under_Review
                        )
                )
        );
        // ================= NOTIFICATIONS =================
        dto.setTotalNotifications(notificationRepository.count());
        // ================= AUDIT LOGS =================
        dto.setTotalAuditLogs(applicationLogRepository.count());
        return dto;
    }
}