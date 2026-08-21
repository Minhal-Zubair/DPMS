package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.entity.Notification;
import com.dpms.dpmsbackend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;


    // ==============================
    // Create Notification
    // ==============================
    public Notification createNotification(Long userId,
                                           String title,
                                           String message) {

        System.out.println("===== NOTIFICATION CREATED =====");
        System.out.println("User ID: " + userId);
        System.out.println("Title: " + title);

        Notification notification = new Notification();

        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIsRead(false);

        return notificationRepository.save(notification);
    }

    // ==============================
    // Get User Notifications
    // ==============================
    public List<Notification> getNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ==============================
    // Count Unread
    // ==============================
    public long getUnreadCount(Long userId) {

        return notificationRepository
                .countByUserIdAndIsReadFalse(userId);
    }

    // ==============================
    // Mark One Notification Read
    // ==============================
    public void markAsRead(Long id) {

        Notification notification =
                notificationRepository.findById(id).orElse(null);

        if (notification != null) {

            notification.setIsRead(true);

            notificationRepository.save(notification);
        }
    }

    // ==============================
    // Mark All Read
    // ==============================
    public void markAllRead(Long userId) {

        List<Notification> notifications =
                notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        for (Notification notification : notifications) {

            notification.setIsRead(true);

            notificationRepository.save(notification);
        }
    }

    // ==============================
    // Delete Notification
    // ==============================
    public void deleteNotification(Long id) {

        notificationRepository.deleteById(id);
    }
}