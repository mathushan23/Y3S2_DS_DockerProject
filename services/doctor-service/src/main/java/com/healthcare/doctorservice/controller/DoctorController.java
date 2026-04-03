package com.healthcare.doctorservice.controller;

import com.healthcare.doctorservice.dto.DoctorRequest;
import com.healthcare.doctorservice.dto.DoctorResponse;
import com.healthcare.doctorservice.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("service", "doctor-service", "status", "UP");
    }

    @GetMapping
    public List<DoctorResponse> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public DoctorResponse getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DoctorResponse createDoctor(@Valid @RequestBody DoctorRequest request) {
        return doctorService.createDoctor(request);
    }

    @PutMapping("/{id}")
    public DoctorResponse updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorRequest request) {
        return doctorService.updateDoctor(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
    }
}
