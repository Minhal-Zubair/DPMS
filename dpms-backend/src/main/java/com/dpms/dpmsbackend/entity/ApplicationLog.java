package com.dpms.dpmsbackend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Entity
@Table(name="application_logs")
@Data
public class ApplicationLog {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name="application_id")
    private Long applicationId;


    @Column(name="action")
    private String action;

    @Column(length = 500)
    private String description;


    @Column(name="action_by")
    private Long actionBy;


    @Column(name="action_time")
    private LocalDateTime actionTime;



    @PrePersist
    public void onCreate(){

        actionTime = LocalDateTime.now();

    }

}