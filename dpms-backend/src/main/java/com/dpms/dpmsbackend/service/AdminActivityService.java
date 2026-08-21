package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.dto.AdminActivityDTO;

import java.util.List;

public interface AdminActivityService {

    List<AdminActivityDTO> getRecentActivities();

}