package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.dto.AdminSettingDTO;
import com.dpms.dpmsbackend.dto.AdminSettingRequest;

public interface AdminSettingService {

    AdminSettingDTO getSettings();

    AdminSettingDTO updateSettings(
            AdminSettingRequest request
    );

}