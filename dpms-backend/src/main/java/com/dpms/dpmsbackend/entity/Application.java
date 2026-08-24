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
    public enum Status{
        Draft,
        Submitted,
        Under_Review,
        Approved,
        Rejected
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