package com.healthcare.telemedicineservice.controller;

import com.healthcare.telemedicineservice.dto.TelemedicineRequest;
import com.healthcare.telemedicineservice.dto.TelemedicineResponse;
import com.healthcare.telemedicineservice.service.TelemedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/telemedicine")
@RequiredArgsConstructor
public class TelemedicineController {

    private final TelemedicineService telemedicineService;

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("service", "telemedicine-service", "status", "UP");
    }

    @GetMapping
    public List<TelemedicineResponse> getAllSessions() {
        return telemedicineService.getAllSessions();
    }

    @GetMapping("/{id}")
    public TelemedicineResponse getSessionById(@PathVariable Long id) {
        return telemedicineService.getSessionById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TelemedicineResponse createSession(@Valid @RequestBody TelemedicineRequest request) {
        return telemedicineService.createSession(request);
    }

    @PutMapping("/{id}")
    public TelemedicineResponse updateSession(@PathVariable Long id, @Valid @RequestBody TelemedicineRequest request) {
        return telemedicineService.updateSession(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSession(@PathVariable Long id) {
        telemedicineService.deleteSession(id);
    }
}
