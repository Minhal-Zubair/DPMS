package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.entity.Notification;
import com.dpms.dpmsbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // ==========================================
    // Create Notification
    // ==========================================

    @PostMapping("/create")
    public Notification createNotification(@RequestBody Notification notification) {

        return notificationService.createNotification(
                notification.getUserId(),
                notification.getTitle(),
                notification.getMessage()
        );
    }

    // ==========================================
    // Get All Notifications of User
    // ==========================================

    @GetMapping("/user/{userId}")
    public List<Notification> getNotifications(@PathVariable Long userId) {

        return notificationService.getNotifications(userId);
    }

    // ==========================================
    // Get Unread Count
    // ==========================================

    @GetMapping("/user/{userId}/count")
    public long getUnreadCount(@PathVariable Long userId) {

        return notificationService.getUnreadCount(userId);
    }

    // ==========================================
    // Mark Notification Read
    // ==========================================

    @PutMapping("/read/{id}")
    public String markRead(@PathVariable Long id) {

        notificationService.markAsRead(id);

        return "Notification marked as read";
    }

    // ==========================================
    // Mark All Read
    // ==========================================

    @PutMapping("/read-all/{userId}")
    public String markAllRead(@PathVariable Long userId) {

        notificationService.markAllRead(userId);

        return "All notifications marked as read";
    }

    // ==========================================
    // Delete Notification
    // ==========================================

    @DeleteMapping("/{id}")
    public String deleteNotification(@PathVariable Long id) {

        notificationService.deleteNotification(id);

        return "Notification deleted successfully";
    }

}