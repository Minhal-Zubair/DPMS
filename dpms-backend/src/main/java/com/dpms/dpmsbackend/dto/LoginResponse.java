package com.dpms.dpmsbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private Long userId;

    private String token;

    private String username;

    private String firstName;

    private String lastName;


}