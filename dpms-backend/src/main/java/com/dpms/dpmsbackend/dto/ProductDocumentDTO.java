package com.dpms.dpmsbackend.dto;

import lombok.Data;

@Data
public class ProductDocumentDTO {
    private Integer documentTypeId;
    private String documentName;
    private Boolean isRequired;
    private String allowedFormats;
    private Integer maxSizeMb;
}