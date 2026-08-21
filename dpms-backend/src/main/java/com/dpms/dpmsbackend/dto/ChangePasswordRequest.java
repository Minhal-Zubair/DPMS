package com.dpms.dpmsbackend.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {

    private Long userId;

    private String currentPassword;

    private String newPassword;

}