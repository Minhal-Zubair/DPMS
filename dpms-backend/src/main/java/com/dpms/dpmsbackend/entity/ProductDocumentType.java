package com.dpms.dpmsbackend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "product_document_types")
@Data
public class ProductDocumentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "document_type_id")
    private Integer documentTypeId;

    @Column(name = "is_required")
    private Boolean isRequired;

    @Column(name = "allowed_formats")
    private String allowedFormats;

    @Column(name = "max_size_mb")
    private Integer maxSizeMb;
}