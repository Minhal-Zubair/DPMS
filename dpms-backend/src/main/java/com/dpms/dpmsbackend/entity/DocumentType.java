package com.dpms.dpmsbackend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "document_types")
@Data
public class DocumentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "active")
    private Boolean active = true;
}