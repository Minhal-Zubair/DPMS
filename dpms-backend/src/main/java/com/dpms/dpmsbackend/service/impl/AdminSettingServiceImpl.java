package com.dpms.dpmsbackend.service.impl;

import com.dpms.dpmsbackend.dto.AdminSettingDTO;
import com.dpms.dpmsbackend.dto.AdminSettingRequest;
import com.dpms.dpmsbackend.entity.AdminSetting;
import com.dpms.dpmsbackend.repository.AdminSettingRepository;
import com.dpms.dpmsbackend.service.AdminSettingService;
import org.springframework.stereotype.Service;

@Service
public class AdminSettingServiceImpl
        implements AdminSettingService {

    private final AdminSettingRepository repository;

    public AdminSettingServiceImpl(
            AdminSettingRepository repository
    ) {
        this.repository = repository;
    }

    @Override
    public AdminSettingDTO getSettings() {

        AdminSetting setting =
                repository.findById(1)
                        .orElseThrow(() ->
                                new RuntimeException("Settings not found"));

        AdminSettingDTO dto =
                new AdminSettingDTO();

        dto.setId(setting.getId());
        dto.setOrganizationName(setting.getOrganizationName());
        dto.setOrganizationEmail(setting.getOrganizationEmail());
        dto.setPhone(setting.getPhone());
        dto.setAddress(setting.getAddress());
        dto.setLogo(setting.getLogo());
        dto.setTheme(setting.getTheme());

        return dto;
    }

    @Override
    public AdminSettingDTO updateSettings(
            AdminSettingRequest request
    ) {

        AdminSetting setting =
                repository.findById(1)
                        .orElseThrow(() ->
                                new RuntimeException("Settings not found"));

        setting.setOrganizationName(
                request.getOrganizationName()
        );

        setting.setOrganizationEmail(
                request.getOrganizationEmail()
        );

        setting.setPhone(
                request.getPhone()
        );

        setting.setAddress(
                request.getAddress()
        );

        setting.setLogo(
                request.getLogo()
        );

        setting.setTheme(
                request.getTheme()
        );

        repository.save(setting);

        return getSettings();

    }

}