package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.dto.AdminActivityDTO;
import com.dpms.dpmsbackend.entity.Activity;
import com.dpms.dpmsbackend.repository.ActivityRepository;
import com.dpms.dpmsbackend.service.AdminActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final AdminActivityService adminActivityService;
    private final ActivityRepository activityRepository;

    public ActivityController(
            AdminActivityService adminActivityService,
            ActivityRepository activityRepository
    ) {
        this.adminActivityService = adminActivityService;
        this.activityRepository = activityRepository;
    }

    @GetMapping("/recent")
    public List<AdminActivityDTO> getRecentActivities() {
        return adminActivityService.getRecentActivities();
    }

    @PostMapping
    public ResponseEntity<?> logActivity(@RequestBody Activity activity) {
        activityRepository.save(activity);
        return ResponseEntity.ok("Activity logged");
    }
}