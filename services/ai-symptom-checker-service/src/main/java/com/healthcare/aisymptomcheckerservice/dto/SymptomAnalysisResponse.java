package com.healthcare.aisymptomcheckerservice.dto;

import java.util.List;

public record SymptomAnalysisResponse(
        String summary,
        String urgencyLevel,
        String recommendedSpecialty,
        List<String> possibleConcerns,
        List<String> nextSteps,
        String disclaimer,
        boolean aiGenerated
) {
}
