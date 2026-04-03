package com.healthcare.appointmentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;
    private Long doctorId;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String doctorName;

    private String specialty;

    @Column(nullable = false)
    private LocalDateTime appointmentDateTime;

    @Column(nullable = false)
    private String status;

    private String patientEmail;
    private String patientPhone;
    private String location;
    private String notes;
    private String billingStatus;
    private Double fee;

    @Column(length = 500)
    private String reason;

    @Column(length = 1000)
    private String symptoms;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}