package com.healthcare.patientservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PatientRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phoneNumber;

    private LocalDate dateOfBirth;

    private String gender;

    private String bloodGroup;
 
    private Double height;

    private Double weight;

    private String emergencyContactName;

    private String emergencyContactNumber;

    private String allergies;

    private String chronicConditions;

    private String address;
}
