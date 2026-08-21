package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.dto.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard(Long userId);

}