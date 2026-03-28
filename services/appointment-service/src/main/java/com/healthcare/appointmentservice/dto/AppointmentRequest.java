package com.healthcare.appointmentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentRequest {

    @NotBlank
    private String patientName;

    @NotBlank
    private String doctorName;

    @NotBlank
    private String specialty;

    @NotNull
    private LocalDateTime appointmentDateTime;

    @NotBlank
    private String status;

    private String notes;
}
