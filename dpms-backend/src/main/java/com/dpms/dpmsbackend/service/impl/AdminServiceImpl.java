package com.dpms.dpmsbackend.service.impl;


import com.dpms.dpmsbackend.dto.AdminDashboardDTO;
import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.repository.ApplicationRepository;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.service.AdminService;
import com.dpms.dpmsbackend.service.AdminActivityService;
import com.dpms.dpmsbackend.dto.AdminRecentApplicationDTO;
import com.dpms.dpmsbackend.entity.Product;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.repository.ProductRepository;
import java.util.ArrayList;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import java.util.List;



@Service
public class AdminServiceImpl
        implements AdminService {



    private final ApplicationRepository applicationRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final AdminActivityService adminActivityService;



    public AdminServiceImpl(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            AdminActivityService adminActivityService
    ){

        this.applicationRepository=applicationRepository;
        this.userRepository=userRepository;
        this.productRepository = productRepository;
        this.adminActivityService = adminActivityService;

    }




    @Override
    public AdminDashboardDTO getDashboard(){


        AdminDashboardDTO dto =
                new AdminDashboardDTO();



        dto.setTotalUsers(
                userRepository.count()
        );



        dto.setTotalApplications(
                applicationRepository.count()
        );



        dto.setPendingApplications(
                applicationRepository.countByStatusIn(
                        List.of(
                                Application.Status.Submitted,
                                Application.Status.Under_Review
                        )
                )
        );



        dto.setApprovedApplications(
                applicationRepository.countByStatus(
                        Application.Status.Approved
                )
        );



        dto.setRejectedApplications(
                applicationRepository.countByStatus(
                        Application.Status.Rejected
                )
        );

        List<Application> applications =
                applicationRepository.findTop5ByOrderByCreatedAtDesc();

        List<AdminRecentApplicationDTO> recentApplications =
                new ArrayList<>();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd MMM yyyy");

        for (Application application : applications) {

            AdminRecentApplicationDTO recent =
                    new AdminRecentApplicationDTO();

            recent.setApplicationNumber(
                    application.getApplicationNumber()
            );

            User user =
                    userRepository.findById(application.getUserId())
                            .orElse(null);

            if (user != null) {

                recent.setApplicant(
                        user.getFirstName() + " " + user.getLastName()
                );

            } else {

                recent.setApplicant("Unknown");

            }

            Product product =
                    productRepository.findById(application.getProductId())
                            .orElse(null);

            if (product != null) {

                recent.setProduct(
                        product.getProductName()
                );

            } else {

                recent.setProduct("N/A");

            }

            recent.setStatus(
                    application.getStatus().name().replace("_", " ")
            );

            recent.setDate(
                    application.getCreatedAt().format(formatter)
            );

            recentApplications.add(recent);

        }

        dto.setRecentApplications(recentApplications);

        dto.setRecentActivities(
                adminActivityService.getRecentActivities()
        );

        // ── Chart 1: Monthly applications (last 6 months) ──
        List<Application> allApps = applicationRepository.findAll();
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, Long> monthMap = new LinkedHashMap<>();

        // Initialize last 6 months
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        for (int i = 5; i >= 0; i--) {
            monthMap.put(now.minusMonths(i).format(monthFmt), 0L);
        }

        for (Application app : allApps) {
            if (app.getCreatedAt() == null) continue;
            String month = app.getCreatedAt().format(monthFmt);
            if (monthMap.containsKey(month)) {
                monthMap.put(month, monthMap.get(month) + 1);
            }
        }

        List<Map<String, Object>> monthlyData = new ArrayList<>();
        monthMap.forEach((month, count) -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", month);
            entry.put("count", count);
            monthlyData.add(entry);
        });
        dto.setMonthlyApplications(monthlyData);

        // ── Chart 2: Status breakdown ──
        Map<String, Long> statusCount = new LinkedHashMap<>();
        statusCount.put("Submitted", applicationRepository.countByStatus(Application.Status.Submitted));
        statusCount.put("Under Review", applicationRepository.countByStatus(Application.Status.Under_Review));
        statusCount.put("Approved", applicationRepository.countByStatus(Application.Status.Approved));
        statusCount.put("Rejected", applicationRepository.countByStatus(Application.Status.Rejected));
        statusCount.put("Draft", applicationRepository.countByStatus(Application.Status.Draft));

        List<Map<String, Object>> statusData = new ArrayList<>();
        statusCount.forEach((status, count) -> {
            if (count > 0) {
                Map<String, Object> entry = new HashMap<>();
                entry.put("status", status);
                entry.put("count", count);
                statusData.add(entry);
            }
        });
        dto.setStatusBreakdown(statusData);

        // ── Chart 3: Applications per product ──
        List<Product> products = productRepository.findAll();
        List<Map<String, Object>> productData = new ArrayList<>();
        for (Product product : products) {
            long count = allApps.stream()
                    .filter(a -> product.getId().equals(a.getProductId()))
                    .count();
            Map<String, Object> entry = new HashMap<>();
            entry.put("product", product.getProductName());
            entry.put("count", count);
            productData.add(entry);
        }
        dto.setProductBreakdown(productData);

        return dto;
    }
}