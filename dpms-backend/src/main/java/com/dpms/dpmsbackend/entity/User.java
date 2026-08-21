package com.dpms.dpmsbackend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Table(name="users")
@Data
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name="first_name")
    private String firstName;


    @Column(name="last_name")
    private String lastName;


    @Column(unique=true)
    private String username;


    @Column(unique=true)
    private String email;


    @Column(unique=true)
    private String cnic;


    private String phone;


    private String password;



    // =========================
    // Profile Image
    // =========================

    @Lob
    @Column(
            name="profile_image",
            columnDefinition="LONGBLOB"
    )
    private byte[] profileImage;


    @Column(name="profile_image_type")
    private String profileImageType;



    // =========================
    // Account Status
    // =========================


    @Column(name="enabled")
    private Boolean enabled=true;



    @Column(name="account_locked")
    private Boolean accountLocked=false;



    // =========================
    // Dates
    // =========================

    @Column(name="created_at")
    private LocalDateTime createdAt;


    @Column(name="updated_at")
    private LocalDateTime updatedAt;



    @Column(name="role_id")
    private Long roleId;



    @Column(name="last_login")
    private LocalDateTime lastLogin;



    @PrePersist
    public void onCreate(){

        createdAt = LocalDateTime.now();

        updatedAt = LocalDateTime.now();

    }



    @PreUpdate
    public void onUpdate(){

        updatedAt = LocalDateTime.now();

    }

}