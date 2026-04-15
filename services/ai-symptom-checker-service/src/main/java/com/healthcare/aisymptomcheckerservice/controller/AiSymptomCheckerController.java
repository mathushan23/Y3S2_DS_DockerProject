package com.healthcare.aisymptomcheckerservice.controller;

import com.healthcare.aisymptomcheckerservice.dto.SymptomAnalysisRequest;
import com.healthcare.aisymptomcheckerservice.dto.SymptomAnalysisResponse;
import com.healthcare.aisymptomcheckerservice.service.SymptomAnalysisService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/symptoms")
public class AiSymptomCheckerController {

    private final SymptomAnalysisService symptomAnalysisService;

    public AiSymptomCheckerController(SymptomAnalysisService symptomAnalysisService) {
        this.symptomAnalysisService = symptomAnalysisService;
    }

    @Value("${PATIENT_SERVICE_URL:http://localhost:8082}")
    private String patientServiceUrl;

    @Value("${DOCTOR_SERVICE_URL:http://localhost:8083}")
    private String doctorServiceUrl;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String geminiModel;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
                "service", "ai-symptom-checker-service",
                "status", "UP",
                "patientServiceUrl", patientServiceUrl,
                "doctorServiceUrl", doctorServiceUrl,
                "geminiModel", geminiModel
        );
    }

    @GetMapping("/metadata")
    public Map<String, List<String>> metadata() {
        return Map.of(
                "supportedUrgencyLevels", List.of("LOW", "MEDIUM", "HIGH", "EMERGENCY"),
                "supportedSpecialties", List.of(
                        "General Medicine",
                        "Cardiology",
                        "Dermatology",
                        "ENT",
                        "Neurology",
                        "Orthopedics",
                        "Gastroenterology",
                        "Pulmonology",
                        "Gynecology",
                        "Pediatrics",
                        "Psychiatry",
                        "Endocrinology",
                        "Ophthalmology",
                        "Urology",
                        "Nephrology"
                )
        );
    }

    @PostMapping("/analyze")
    public SymptomAnalysisResponse analyze(@Valid @RequestBody SymptomAnalysisRequest request) {
        return symptomAnalysisService.analyze(request);
    }
}
