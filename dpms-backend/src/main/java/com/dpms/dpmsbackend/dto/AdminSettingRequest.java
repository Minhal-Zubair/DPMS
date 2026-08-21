package com.dpms.dpmsbackend.dto;

import lombok.Data;

@Data
public class AdminSettingRequest {

    private String organizationName;

    private String organizationEmail;

    private String phone;

    private String address;

    private String logo;

    private String theme;

}