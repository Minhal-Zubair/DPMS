package com.dpms.dpmsbackend.repository;
import com.dpms.dpmsbackend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dpms.dpmsbackend.entity.Application.Status;
import java.util.List;
public interface ApplicationRepository
        extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    long countByStatus(Application.Status status);
    long countByStatusIn(List<Application.Status> statuses);
    List<Application> findTop5ByOrderByCreatedAtDesc();
    List<Application> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, Application.Status status);
    List<Application> findAllByOrderByCreatedAtDesc();
}