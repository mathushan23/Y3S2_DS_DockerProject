package com.healthcare.telemedicineservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class TelemedicineResponse {

    private Long id;
    private Long appointmentId;
    private String patientName;
    private String doctorName;
    private String meetingLink;
    private LocalDateTime scheduledAt;
    private String status;
}
