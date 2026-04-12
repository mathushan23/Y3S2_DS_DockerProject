package com.healthcare.patientservice.controller;

import com.healthcare.patientservice.dto.PatientRequest;
import com.healthcare.patientservice.dto.PatientResponse;
import com.healthcare.patientservice.service.PatientService;
import jakarta.validation.Valid;
import com.healthcare.patientservice.entity.MedicalReport;
import com.healthcare.patientservice.entity.Prescription;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public List<PatientResponse> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public PatientResponse getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PatientResponse createPatient(@Valid @RequestBody PatientRequest request) {
        return patientService.createPatient(request);
    }

    @PutMapping("/{id}")
    public PatientResponse updatePatient(@PathVariable Long id, @Valid @RequestBody PatientRequest request) {
        return patientService.updatePatient(id, request);
    }

    @GetMapping("/{id}/reports")
    public List<MedicalReport> getReports(@PathVariable Long id) {
        return patientService.getReportsByPatient(id);
    }

    @GetMapping("/{id}/prescriptions")
    public List<Prescription> getPrescriptions(@PathVariable Long id) {
        return patientService.getPrescriptionsByPatient(id);
    }
}
