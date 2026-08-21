package com.dpms.dpmsbackend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Table(name = "admin_settings")
@Data
public class AdminSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String organizationName;
    private String organizationEmail;
    private String phone;
    private String address;
    private String logo;
    private String theme;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}