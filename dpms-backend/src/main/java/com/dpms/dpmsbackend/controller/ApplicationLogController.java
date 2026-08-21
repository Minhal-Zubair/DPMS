package com.dpms.dpmsbackend.controller;
import com.dpms.dpmsbackend.entity.ApplicationLog;
import com.dpms.dpmsbackend.service.ApplicationLogService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationLogController {
    private final ApplicationLogService applicationLogService;
    public ApplicationLogController(
            ApplicationLogService applicationLogService
    ) {
        this.applicationLogService = applicationLogService;
    }
    @GetMapping
    public List<ApplicationLog> getAllLogs() {
        return applicationLogService.getAllLogs();
    }
}