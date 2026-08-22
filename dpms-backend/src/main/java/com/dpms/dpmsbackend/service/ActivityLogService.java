package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.entity.Activity;
import com.dpms.dpmsbackend.repository.ActivityRepository;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {

    private final ActivityRepository activityRepository;

    public ActivityLogService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public void log(String type, String description, Long userId, Long applicationId) {
        Activity activity = new Activity();
        activity.setType(type);
        activity.setDescription(description);
        activity.setUserId(userId);
        activity.setApplicationId(applicationId);
        activityRepository.save(activity);
    }
}