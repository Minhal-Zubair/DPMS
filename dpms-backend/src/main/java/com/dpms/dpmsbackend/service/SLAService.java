package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.dto.SLAApplicationDTO;
import com.dpms.dpmsbackend.dto.SLAStatsDTO;
import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.entity.Product;
import com.dpms.dpmsbackend.repository.ApplicationRepository;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class SLAService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public SLAService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            ProductRepository productRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Set SLA for an application
    public void setSLA(Long applicationId, Integer slaDays) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setSlaDays(slaDays);
        // Deadline = submission date + SLA days
        LocalDateTime start = app.getCreatedAt() != null
                ? app.getCreatedAt() : LocalDateTime.now();
        app.setSlaDeadline(start.plusDays(slaDays));
        applicationRepository.save(app);
    }

    // Get SLA status for all applications
    public List<SLAApplicationDTO> getAllSLAApplications() {
        List<Application> applications = applicationRepository.findAll();
        List<SLAApplicationDTO> result = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");

        for (Application app : applications) {
            SLAApplicationDTO dto = new SLAApplicationDTO();
            dto.setId(app.getId());
            dto.setApplicationNumber(app.getApplicationNumber());
            dto.setStatus(app.getStatus().name().replace("_", " "));
            dto.setSlaDays(app.getSlaDays());

            // Applicant name
            if (app.getUserId() != null) {
                userRepository.findById(app.getUserId()).ifPresent(u ->
                    dto.setApplicant(u.getFirstName() + " " + u.getLastName())
                );
            }
            if (dto.getApplicant() == null) dto.setApplicant("Unknown");

            // Product name
            if (app.getProductId() != null) {
                productRepository.findById(app.getProductId()).ifPresent(p ->
                    dto.setProduct(p.getProductName())
                );
            }
            if (dto.getProduct() == null) dto.setProduct("N/A");

            // Calculate SLA status
            boolean closed = app.getStatus() == Application.Status.Approved
                    || app.getStatus() == Application.Status.Rejected;

            long daysElapsed = 0;
            if (app.getCreatedAt() != null) {
                LocalDateTime end = closed && app.getUpdatedAt() != null
                        ? app.getUpdatedAt() : LocalDateTime.now();
                daysElapsed = ChronoUnit.DAYS.between(app.getCreatedAt(), end);
            }
            dto.setDaysElapsed(daysElapsed);

            if (app.getSlaDeadline() != null) {
                dto.setSlaDeadline(app.getSlaDeadline().format(fmt));
                long daysRemaining = ChronoUnit.DAYS.between(
                        LocalDateTime.now(), app.getSlaDeadline());
                dto.setDaysRemaining(daysRemaining);

                if (closed) {
                    dto.setSlaStatus("COMPLETED");
                } else if (daysRemaining < 0) {
                    dto.setSlaStatus("OVERDUE");
                } else if (daysRemaining <= 2) {
                    dto.setSlaStatus("AT_RISK");
                } else {
                    dto.setSlaStatus("ON_TRACK");
                }
            } else {
                // No SLA set — use default 5-day rule
                dto.setSlaDeadline("Not set");
                dto.setDaysRemaining(closed ? 0 : 5 - daysElapsed);
                if (closed) {
                    dto.setSlaStatus("COMPLETED");
                } else if (daysElapsed > 5) {
                    dto.setSlaStatus("OVERDUE");
                } else if (daysElapsed >= 4) {
                    dto.setSlaStatus("AT_RISK");
                } else {
                    dto.setSlaStatus("ON_TRACK");
                }
            }

            result.add(dto);
        }
        return result;
    }

    // Get SLA statistics
    public SLAStatsDTO getStats() {
        List<SLAApplicationDTO> all = getAllSLAApplications();

        SLAStatsDTO stats = new SLAStatsDTO();
        stats.setTotalActive(all.stream()
                .filter(a -> !a.getSlaStatus().equals("COMPLETED")).count());
        stats.setOnTrack(all.stream()
                .filter(a -> a.getSlaStatus().equals("ON_TRACK")).count());
        stats.setAtRisk(all.stream()
                .filter(a -> a.getSlaStatus().equals("AT_RISK")).count());
        stats.setOverdue(all.stream()
                .filter(a -> a.getSlaStatus().equals("OVERDUE")).count());
        stats.setCompleted(all.stream()
                .filter(a -> a.getSlaStatus().equals("COMPLETED")).count());

        // Average processing days for completed applications
        double avgDays = all.stream()
                .filter(a -> a.getSlaStatus().equals("COMPLETED"))
                .mapToLong(SLAApplicationDTO::getDaysElapsed)
                .average()
                .orElse(0.0);
        stats.setAverageProcessingDays(Math.round(avgDays * 10.0) / 10.0);

        // SLA compliance = completed within SLA / total completed
        long completedCount = stats.getCompleted();
        if (completedCount > 0) {
            long compliant = all.stream()
                    .filter(a -> a.getSlaStatus().equals("COMPLETED")
                            && a.getDaysRemaining() >= 0)
                    .count();
            stats.setSlaComplianceRate(
                    Math.round((double) compliant / completedCount * 1000.0) / 10.0
            );
        } else {
            stats.setSlaComplianceRate(0.0);
        }

        return stats;
    }
}