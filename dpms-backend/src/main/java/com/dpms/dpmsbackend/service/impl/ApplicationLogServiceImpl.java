package com.dpms.dpmsbackend.service.impl;
import com.dpms.dpmsbackend.entity.ApplicationLog;
import com.dpms.dpmsbackend.repository.ApplicationLogRepository;
import com.dpms.dpmsbackend.service.ApplicationLogService;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ApplicationLogServiceImpl
        implements ApplicationLogService {
    private final ApplicationLogRepository repository;
    public ApplicationLogServiceImpl(
            ApplicationLogRepository repository){
        this.repository = repository;
    }
    @Override
    public void saveLog(
            Long applicationId,
            Long userId,
            String action
    ){
        saveLog(
                applicationId,
                userId,
                action,
                null
        );
    }
    @Override
    public void saveLog(
            Long applicationId,
            Long userId,
            String action,
            String description
    ){
        ApplicationLog log = new ApplicationLog();
        log.setApplicationId(applicationId);
        log.setAction(action);
        log.setDescription(description);
        log.setActionBy(userId);
        repository.save(log);
    }
    @Override
    public List<ApplicationLog> getAllLogs() {
        return repository.findAllByOrderByActionTimeDesc();
    }

    @Override
    public List<ApplicationLog> getLogsByApplicationId(Long applicationId) {
        return repository.findByApplicationIdOrderByActionTimeAsc(applicationId);
    }
}