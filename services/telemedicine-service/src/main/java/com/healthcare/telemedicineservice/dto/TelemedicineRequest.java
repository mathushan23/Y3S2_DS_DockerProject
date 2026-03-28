package com.healthcare.telemedicineservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TelemedicineRequest {

    private Long appointmentId;

    @NotBlank
    private String patientName;

    @NotBlank
    private String doctorName;

    @NotBlank
    private String meetingLink;

    @NotNull
    private LocalDateTime scheduledAt;

    @NotBlank
    private String status;
}
