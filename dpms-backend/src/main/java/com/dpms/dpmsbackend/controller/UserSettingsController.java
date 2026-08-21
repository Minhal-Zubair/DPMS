package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.entity.UserSettings;
import com.dpms.dpmsbackend.service.UserSettingsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    public UserSettingsController(UserSettingsService userSettingsService) {
        this.userSettingsService = userSettingsService;
    }

    // ==========================================
    // Get User Settings
    // ==========================================

    @GetMapping("/{userId}")
    public UserSettings getSettings(@PathVariable Long userId) {

        return userSettingsService.getSettings(userId);

    }

    // ==========================================
    // Update User Settings
    // ==========================================

    @PutMapping("/{userId}")
    public UserSettings updateSettings(
            @PathVariable Long userId,
            @RequestBody UserSettings settings
    ) {

        return userSettingsService.updateSettings(userId, settings);

    }

}