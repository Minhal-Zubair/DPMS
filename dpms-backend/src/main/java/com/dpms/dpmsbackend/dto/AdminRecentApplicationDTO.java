package com.dpms.dpmsbackend.dto;

import lombok.Data;

@Data
public class AdminRecentApplicationDTO {

    private String applicationNumber;

    private String applicant;

    private String product;

    private String status;

    private String date;

}