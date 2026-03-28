package com.healthcare.aisymptomcheckerservice.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/symptoms")
public class AiSymptomCheckerController {

    @Value("${PATIENT_SERVICE_URL:http://localhost:8082}")
    private String patientServiceUrl;

    @Value("${DOCTOR_SERVICE_URL:http://localhost:8083}")
    private String doctorServiceUrl;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
                "service", "ai-symptom-checker-service",
                "status", "UP",
                "patientServiceUrl", patientServiceUrl,
                "doctorServiceUrl", doctorServiceUrl
        );
    }
}
