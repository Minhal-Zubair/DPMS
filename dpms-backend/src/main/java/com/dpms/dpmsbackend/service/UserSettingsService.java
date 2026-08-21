package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.entity.UserSettings;
import com.dpms.dpmsbackend.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final NotificationService notificationService;

    public UserSettingsService(
            UserSettingsRepository userSettingsRepository,
            NotificationService notificationService
    ) {
        this.userSettingsRepository = userSettingsRepository;
        this.notificationService = notificationService;
    }

    // ==========================================
    // Get User Settings
    // ==========================================
    public UserSettings getSettings(Long userId) {

        return userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> {

                    UserSettings settings = new UserSettings();

                    settings.setUserId(userId);
                    settings.setDarkMode(false);
                    settings.setEmailNotifications(true);
                    settings.setSmsNotifications(false);
                    settings.setTwoFactorAuth(false);
                    settings.setLanguage("English");
                    settings.setAutoLogout(15);

                    return userSettingsRepository.save(settings);
                });
    }

    // ==========================================
    // Update User Settings
    // ==========================================
    public UserSettings updateSettings(Long userId, UserSettings newSettings) {

        UserSettings settings = userSettingsRepository
                .findByUserId(userId)
                .orElseGet(() -> {
                    UserSettings s = new UserSettings();
                    s.setUserId(userId);
                    return s;
                });

        settings.setDarkMode(newSettings.getDarkMode());
        settings.setEmailNotifications(newSettings.getEmailNotifications());
        settings.setSmsNotifications(newSettings.getSmsNotifications());
        settings.setTwoFactorAuth(newSettings.getTwoFactorAuth());
        settings.setLanguage(newSettings.getLanguage());
        settings.setAutoLogout(newSettings.getAutoLogout());

        UserSettings savedSettings = userSettingsRepository.save(settings);

        // Create notification
        notificationService.createNotification(
                userId,
                "Settings Updated",
                "Your account settings have been updated successfully."
        );

        return savedSettings;
    }

}