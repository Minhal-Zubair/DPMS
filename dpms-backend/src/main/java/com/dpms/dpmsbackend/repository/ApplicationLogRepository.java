package com.dpms.dpmsbackend.repository;
import com.dpms.dpmsbackend.entity.ApplicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ApplicationLogRepository
        extends JpaRepository<ApplicationLog, Long> {
    List<ApplicationLog> findAllByOrderByActionTimeDesc();
}