package com.healthcare.doctorservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    private String specialty;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phoneNumber;

    private String availability;

    private boolean verified;
}
