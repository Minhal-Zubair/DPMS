package com.dpms.dpmsbackend.service.impl;

import com.dpms.dpmsbackend.dto.AdminActivityDTO;
import com.dpms.dpmsbackend.entity.Activity;
import com.dpms.dpmsbackend.entity.Application;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.repository.ActivityRepository;
import com.dpms.dpmsbackend.repository.ApplicationRepository;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.service.AdminActivityService;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminActivityServiceImpl implements AdminActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public AdminActivityServiceImpl(
            ActivityRepository activityRepository,
            UserRepository userRepository,
            ApplicationRepository applicationRepository
    ) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public List<AdminActivityDTO> getRecentActivities() {

        List<Activity> activities =
                activityRepository.findTop10ByOrderByCreatedAtDesc();

        List<AdminActivityDTO> response =
                new ArrayList<>();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm");

        for (Activity activity : activities) {

            AdminActivityDTO dto =
                    new AdminActivityDTO();

            dto.setType(activity.getType());

            String description =
                    activity.getDescription();

            // User Name
            if (activity.getUserId() != null) {

                User user =
                        userRepository.findById(activity.getUserId())
                                .orElse(null);

                if (user != null) {

                    description +=
                            " by " +
                                    user.getFirstName() +
                                    " " +
                                    user.getLastName();

                }

            }

            // Application Number
            if (activity.getApplicationId() != null) {

                Application application =
                        applicationRepository.findById(activity.getApplicationId())
                                .orElse(null);

                if (application != null) {

                    description +=
                            " (" +
                                    application.getApplicationNumber() +
                                    ")";

                }

            }

            dto.setDescription(description);

            dto.setTime(
                    activity.getCreatedAt().format(formatter)
            );

            response.add(dto);

        }

        return response;

    }

}