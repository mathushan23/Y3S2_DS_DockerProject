package com.healthcare.doctorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DoctorResponse {

    private Long id;
    private String fullName;
    private String specialty;
    private String email;
    private String phoneNumber;
    private String availability;
    private boolean verified;
}
