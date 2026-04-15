package com.healthcare.aisymptomcheckerservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.aisymptomcheckerservice.dto.SymptomAnalysisRequest;
import com.healthcare.aisymptomcheckerservice.dto.SymptomAnalysisResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class SymptomAnalysisService {

    private static final String DEFAULT_DISCLAIMER =
            "This is a preliminary AI-assisted suggestion, not a diagnosis. Consult a licensed doctor for medical advice.";

    private static final List<String> SUPPORTED_SPECIALTIES = List.of(
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
    );

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String geminiApiKey;
    private final String geminiModel;

    public SymptomAnalysisService(
            ObjectMapper objectMapper,
            @Value("${gemini.api.key:}") String geminiApiKey,
            @Value("${gemini.model:gemini-2.5-flash}") String geminiModel
    ) {
        this.objectMapper = objectMapper;
        this.geminiApiKey = geminiApiKey;
        this.geminiModel = geminiModel;
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public SymptomAnalysisResponse analyze(SymptomAnalysisRequest request) {
        if (!StringUtils.hasText(geminiApiKey)) {
            return buildFallbackResponse(request, false);
        }

        try {
            return analyzeWithGemini(request);
        } catch (Exception ignored) {
            return buildFallbackResponse(request, false);
        }
    }

    private SymptomAnalysisResponse analyzeWithGemini(SymptomAnalysisRequest request) throws Exception {
        Map<String, Object> geminiRequest = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", buildPrompt(request)))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.2,
                        "responseMimeType", "application/json"
                )
        );

        JsonNode response = restClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/{model}:generateContent")
                        .queryParam("key", geminiApiKey)
                        .build(geminiModel))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .body(geminiRequest)
                .retrieve()
                .body(JsonNode.class);

        String rawJson = extractText(response);
        if (!StringUtils.hasText(rawJson)) {
            return buildFallbackResponse(request, false);
        }

        JsonNode parsed = objectMapper.readTree(stripCodeFences(rawJson));
        String recommendedSpecialty = normalizeSpecialty(parsed.path("recommendedSpecialty").asText(""));

        return new SymptomAnalysisResponse(
                nonBlank(parsed.path("summary").asText(), summarizeSymptoms(request.symptoms())),
                normalizeUrgency(parsed.path("urgencyLevel").asText("MEDIUM")),
                recommendedSpecialty,
                readList(parsed.path("possibleConcerns"), List.of("Further clinical evaluation may be required.")),
                readList(parsed.path("nextSteps"), defaultNextSteps(recommendedSpecialty)),
                nonBlank(parsed.path("disclaimer").asText(), DEFAULT_DISCLAIMER),
                true
        );
    }

    private String extractText(JsonNode response) {
        JsonNode parts = response.path("candidates");
        if (!parts.isArray() || parts.isEmpty()) {
            return null;
        }

        JsonNode textNode = parts.get(0)
                .path("content")
                .path("parts");

        if (!textNode.isArray() || textNode.isEmpty()) {
            return null;
        }

        return textNode.get(0).path("text").asText(null);
    }

    private String buildPrompt(SymptomAnalysisRequest request) {
        List<String> conditions = request.existingConditions() == null ? List.of() : request.existingConditions();
        String conditionsText = conditions.isEmpty() ? "None provided" : String.join(", ", conditions);

        return """
                You are a healthcare triage assistant for a booking app.
                Analyze the patient-reported symptoms and return only valid JSON.
                Do not provide a final diagnosis. Provide a likely care direction.

                Allowed urgencyLevel values: LOW, MEDIUM, HIGH, EMERGENCY
                Allowed recommendedSpecialty values: %s

                Return JSON with this exact shape:
                {
                  "summary": "Short plain-English overview",
                  "urgencyLevel": "LOW|MEDIUM|HIGH|EMERGENCY",
                  "recommendedSpecialty": "One allowed specialty",
                  "possibleConcerns": ["2 to 4 broad concern categories"],
                  "nextSteps": ["2 to 4 safe next steps"],
                  "disclaimer": "Short medical disclaimer"
                }

                Patient input:
                Symptoms: %s
                Age: %s
                Gender: %s
                Duration: %s
                Existing conditions: %s
                """.formatted(
                String.join(", ", SUPPORTED_SPECIALTIES),
                request.symptoms(),
                request.age() == null ? "Not provided" : request.age(),
                nonBlank(request.gender(), "Not provided"),
                nonBlank(request.duration(), "Not provided"),
                conditionsText
        );
    }

    private SymptomAnalysisResponse buildFallbackResponse(SymptomAnalysisRequest request, boolean aiGenerated) {
        String specialty = inferSpecialty(request.symptoms());
        return new SymptomAnalysisResponse(
                summarizeSymptoms(request.symptoms()),
                inferUrgency(request.symptoms()),
                specialty,
                inferConcerns(request.symptoms(), specialty),
                defaultNextSteps(specialty),
                DEFAULT_DISCLAIMER,
                aiGenerated
        );
    }

    private String summarizeSymptoms(String symptoms) {
        String normalized = symptoms == null ? "" : symptoms.trim();
        if (normalized.length() <= 160) {
            return normalized;
        }
        return normalized.substring(0, 157) + "...";
    }

    private String inferSpecialty(String symptoms) {
        String text = symptoms == null ? "" : symptoms.toLowerCase(Locale.ROOT);

        Map<String, List<String>> keywordMap = new LinkedHashMap<>();
        keywordMap.put("Cardiology", List.of("chest pain", "palpitation", "heart", "pressure", "shortness of breath"));
        keywordMap.put("Pulmonology", List.of("cough", "wheezing", "breathing", "asthma", "lung"));
        keywordMap.put("Dermatology", List.of("rash", "itch", "skin", "acne", "eczema"));
        keywordMap.put("ENT", List.of("ear", "nose", "throat", "sinus", "hearing"));
        keywordMap.put("Neurology", List.of("headache", "migraine", "seizure", "numbness", "dizziness"));
        keywordMap.put("Orthopedics", List.of("joint", "knee", "back pain", "fracture", "swelling"));
        keywordMap.put("Gastroenterology", List.of("stomach", "abdomen", "vomit", "diarrhea", "nausea"));
        keywordMap.put("Gynecology", List.of("period", "pregnancy", "pelvic", "menstrual"));
        keywordMap.put("Ophthalmology", List.of("vision", "eye", "blurred", "red eye"));
        keywordMap.put("Psychiatry", List.of("anxiety", "panic", "depression", "stress", "sleep"));
        keywordMap.put("Endocrinology", List.of("thyroid", "sugar", "diabetes", "weight gain", "hormone"));
        keywordMap.put("Urology", List.of("urine", "urinary", "kidney stone", "bladder"));
        keywordMap.put("Pediatrics", List.of("child", "baby", "infant"));

        for (Map.Entry<String, List<String>> entry : keywordMap.entrySet()) {
            boolean matched = entry.getValue().stream().anyMatch(text::contains);
            if (matched) {
                return entry.getKey();
            }
        }

        return "General Medicine";
    }

    private String inferUrgency(String symptoms) {
        String text = symptoms == null ? "" : symptoms.toLowerCase(Locale.ROOT);
        if (containsAny(text, List.of("severe chest pain", "cannot breathe", "unconscious", "stroke", "seizure", "severe bleeding"))) {
            return "EMERGENCY";
        }
        if (containsAny(text, List.of("chest pain", "shortness of breath", "high fever", "fainting", "vomiting blood"))) {
            return "HIGH";
        }
        if (containsAny(text, List.of("fever", "pain", "rash", "cough", "headache"))) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private List<String> inferConcerns(String symptoms, String specialty) {
        String text = symptoms == null ? "" : symptoms.toLowerCase(Locale.ROOT);
        List<String> concerns = new ArrayList<>();

        if (text.contains("fever")) {
            concerns.add("Infection or inflammation");
        }
        if (text.contains("pain")) {
            concerns.add("Pain requiring medical assessment");
        }
        if (text.contains("cough") || text.contains("breath")) {
            concerns.add("Respiratory irritation or infection");
        }
        if (text.contains("rash") || text.contains("itch")) {
            concerns.add("Skin or allergy-related issue");
        }

        if (concerns.isEmpty()) {
            concerns.add(specialty + " review may be appropriate");
            concerns.add("Symptoms need clinician assessment for accurate diagnosis");
        }

        return concerns.stream().limit(4).toList();
    }

    private List<String> defaultNextSteps(String specialty) {
        return List.of(
                "Monitor symptoms closely and note any worsening signs.",
                "Book a consultation with " + specialty + ".",
                "Seek urgent in-person care if symptoms become severe."
        );
    }

    private boolean containsAny(String text, List<String> candidates) {
        return candidates.stream().anyMatch(text::contains);
    }

    private String normalizeSpecialty(String specialty) {
        if (!StringUtils.hasText(specialty)) {
            return "General Medicine";
        }

        return SUPPORTED_SPECIALTIES.stream()
                .filter(value -> value.equalsIgnoreCase(specialty.trim()))
                .findFirst()
                .orElse("General Medicine");
    }

    private String normalizeUrgency(String urgencyLevel) {
        if (!StringUtils.hasText(urgencyLevel)) {
            return "MEDIUM";
        }

        return switch (urgencyLevel.trim().toUpperCase(Locale.ROOT)) {
            case "LOW", "MEDIUM", "HIGH", "EMERGENCY" -> urgencyLevel.trim().toUpperCase(Locale.ROOT);
            default -> "MEDIUM";
        };
    }

    private List<String> readList(JsonNode node, List<String> defaultValue) {
        if (node == null || !node.isArray() || node.isEmpty()) {
            return defaultValue;
        }

        List<String> values = new ArrayList<>();
        node.forEach(item -> {
            String value = item.asText("").trim();
            if (!value.isEmpty()) {
                values.add(value);
            }
        });

        return values.isEmpty() ? defaultValue : values;
    }

    private String stripCodeFences(String value) {
        String trimmed = value == null ? "" : value.trim();
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceFirst("^```json", "").replaceFirst("^```", "");
            trimmed = trimmed.replaceFirst("```$", "").trim();
        }
        return trimmed;
    }

    private String nonBlank(String value, String fallback) {
        return StringUtils.hasText(value) ? value.trim() : fallback;
    }
}
