package com.dpms.dpmsbackend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ApplicationResponse {

    private Integer id;

    private String applicationNumber;

    private Long userId;

    private String username;

    private Integer productId;

    private String productName;

    private String cnic;

    private LocalDate productionDate;

    private String status;

    private String remarks;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}