package com.healthcare.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class AppointmentResponse {

    private Long id;
    private String patientName;
    private String doctorName;
    private String specialty;
    private LocalDateTime appointmentDateTime;
    private String status;
    private String notes;
}
