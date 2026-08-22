package com.dpms.dpmsbackend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Table(name="documents")
@Data
public class Document {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name="application_id")
    private Long applicationId;


    @Column(name="document_type_id")
    private Integer documentTypeId;


    @Column(name="original_name")
    private String originalName;






    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name="file_data", columnDefinition="LONGBLOB")
    private byte[] fileData;


    @Column(name="file_size")
    private Long fileSize;

    @Column(name="file_hash", length = 64)
    private String fileHash;


    @Column(name="uploaded_by")
    private Long uploadedBy;


    @Column(name="verified")
    private Boolean verified=false;


    private String remarks;


    @Column(name="uploaded_at")
    private LocalDateTime uploadedAt;



    @PrePersist
    public void onCreate(){

        uploadedAt = LocalDateTime.now();

    }

}