package com.healthcare.patientservice.service;

import com.healthcare.patientservice.dto.PatientRequest;
import com.healthcare.patientservice.dto.PatientResponse;
import com.healthcare.patientservice.entity.Patient;
import com.healthcare.patientservice.exception.ResourceNotFoundException;
import com.healthcare.patientservice.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PatientResponse getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return toResponse(patient);
    }

    public PatientResponse createPatient(PatientRequest request) {
        Patient patient = Patient.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .bloodGroup(request.getBloodGroup())
                .height(request.getHeight())
                .weight(request.getWeight())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactNumber(request.getEmergencyContactNumber())
                .allergies(request.getAllergies())
                .chronicConditions(request.getChronicConditions())
                .address(request.getAddress())
                .build();

        return toResponse(patientRepository.save(patient));
    }

    public PatientResponse updatePatient(Long id, PatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setPhoneNumber(request.getPhoneNumber());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setHeight(request.getHeight());
        patient.setWeight(request.getWeight());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactNumber(request.getEmergencyContactNumber());
        patient.setAllergies(request.getAllergies());
        patient.setChronicConditions(request.getChronicConditions());
        patient.setAddress(request.getAddress());

        return toResponse(patientRepository.save(patient));
    }



    private PatientResponse toResponse(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(patient.getEmail())
                .phoneNumber(patient.getPhoneNumber())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .height(patient.getHeight())
                .weight(patient.getWeight())
                .emergencyContactName(patient.getEmergencyContactName())
                .emergencyContactNumber(patient.getEmergencyContactNumber())
                .allergies(patient.getAllergies())
                .chronicConditions(patient.getChronicConditions())
                .address(patient.getAddress())
                .profilePictureUrl(patient.getProfilePictureUrl())
                .build();
    }
}
