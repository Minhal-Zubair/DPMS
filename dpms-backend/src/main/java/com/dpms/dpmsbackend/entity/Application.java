package com.dpms.dpmsbackend.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;



@Entity
@Table(name="applications")
@Data
public class Application {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(unique = true)
    private String applicationNumber;
    private Long userId;
    private String cnic;
    private LocalDate productionDate;
    private Integer productId;
    @Enumerated(EnumType.STRING)
    private Status status = Status.Draft;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Column(name = "sla_days")
    private Integer slaDays;

    @Column(name = "sla_deadline")
    private LocalDateTime slaDeadline;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "reviewer_notes", columnDefinition = "TEXT")
    private String reviewerNotes;

    @Column(name = "correction_request", columnDefinition = "TEXT")
    private String correctionRequest;

    @Column(name = "correction_requested_at")
    private LocalDateTime correctionRequestedAt;

    public enum Status{
        Draft,
        Submitted,
        Under_Review,
        Approved,
        Rejected,
        Correction_Required
    }


    @PrePersist
    public void created(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }


    @PreUpdate
    public void updated(){
        updatedAt = LocalDateTime.now();
    }
}