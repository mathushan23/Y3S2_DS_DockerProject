package com.healthcare.appointmentservice.controller;

import com.healthcare.appointmentservice.dto.AppointmentRequest;
import com.healthcare.appointmentservice.dto.AppointmentResponse;
import com.healthcare.appointmentservice.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("service", "appointment-service");
        response.put("status", "UP");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId) {
        log.info("GET /api/appointments - patientId: {}, doctorId: {}", patientId, doctorId);
        List<AppointmentResponse> appointments = appointmentService.getAllAppointments(patientId, doctorId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable Long id) {
        log.info("GET /api/appointments/{}", id);
        AppointmentResponse appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(appointment);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody AppointmentRequest request) {
        log.info("POST /api/appointments - request: {}", request);
        AppointmentResponse created = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponse> updateAppointment(@PathVariable Long id, @Valid @RequestBody AppointmentRequest request) {
        log.info("PUT /api/appointments/{} - status: {}", id, request.getStatus());
        AppointmentResponse updated = appointmentService.updateAppointment(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        log.info("DELETE /api/appointments/{}", id);
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}