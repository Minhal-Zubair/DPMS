package com.dpms.dpmsbackend.repository;
import com.dpms.dpmsbackend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Get all notifications of a user
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    // Get unread notifications
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    // Count unread notifications
    long countByUserIdAndIsReadFalse(Long userId);
    List<Notification> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);
}