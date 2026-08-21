package com.dpms.dpmsbackend.service;
import java.util.List;
import com.dpms.dpmsbackend.entity.ApplicationLog;
public interface ApplicationLogService {
    void saveLog(
            Long applicationId,
            Long userId,
            String action
    );
    void saveLog(
            Long applicationId,
            Long userId,
            String action,
            String description
    );
    List<ApplicationLog> getAllLogs();
}