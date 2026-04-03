package com.healthcare.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String patientName;
    private String doctorName;
    private String specialty;
    private LocalDateTime appointmentDateTime;
    private String status;
    private String patientEmail;
    private String patientPhone;
    private String location;
    private String notes;
    private String billingStatus;
    private Double fee;
    private String reason;
    private String symptoms;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}