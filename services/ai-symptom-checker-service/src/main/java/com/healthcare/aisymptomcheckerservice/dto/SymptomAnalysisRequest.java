package com.healthcare.aisymptomcheckerservice.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record SymptomAnalysisRequest(
        @NotBlank(message = "Symptoms are required")
        String symptoms,
        Integer age,
        String gender,
        String duration,
        List<String> existingConditions
) {
}
