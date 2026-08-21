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



        return dto;


    }


}