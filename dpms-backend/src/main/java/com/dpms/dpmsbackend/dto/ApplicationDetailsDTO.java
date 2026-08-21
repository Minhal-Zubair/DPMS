package com.dpms.dpmsbackend.dto;
import lombok.Data;
@Data
public class ApplicationDetailsDTO {
    private Long id;
    private String applicationNumber;
    private String applicant;
    private String email;
    private String phone;
    private String cnic;
    private String product;
    private Integer productId;
    private String productionDate;
    private String status;
    private String remarks;
    private String submittedDate;
}