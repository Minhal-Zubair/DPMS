package com.dpms.dpmsbackend.controller;

import com.dpms.dpmsbackend.dto.DashboardResponse;
import com.dpms.dpmsbackend.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{userId}")
    public DashboardResponse getDashboard(
            @PathVariable Long userId
    ) {
        return dashboardService.getDashboard(userId);
    }
}