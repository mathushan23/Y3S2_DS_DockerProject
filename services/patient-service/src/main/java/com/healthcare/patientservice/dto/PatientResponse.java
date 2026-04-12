package com.healthcare.patientservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class PatientResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
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
    private String profilePictureUrl;
}
