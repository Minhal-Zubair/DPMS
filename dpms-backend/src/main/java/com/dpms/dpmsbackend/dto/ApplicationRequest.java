package com.dpms.dpmsbackend.dto;


import lombok.Data;

import java.time.LocalDate;


@Data
public class ApplicationRequest {


    private String cnic;


    private LocalDate productionDate;


    private Integer productId;


    private String remarks;


}