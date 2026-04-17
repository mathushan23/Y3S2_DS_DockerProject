package com.healthcare.appointmentservice.service;

import com.healthcare.appointmentservice.dto.AppointmentRequest;
import com.healthcare.appointmentservice.dto.AppointmentResponse;
import com.healthcare.appointmentservice.entity.Appointment;
import com.healthcare.appointmentservice.exception.ResourceNotFoundException;
import com.healthcare.appointmentservice.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointments(Long patientId, Long doctorId) {
        log.info("Fetching appointments - patientId: {}, doctorId: {}", patientId, doctorId);

        List<Appointment> appointments;

        if (patientId != null) {
            appointments = appointmentRepository.findByPatientId(patientId);
            log.info("Found {} appointments for patientId: {}", appointments.size(), patientId);
        } else if (doctorId != null) {
            appointments = appointmentRepository.findByDoctorId(doctorId);
            log.info("Found {} appointments for doctorId: {}", appointments.size(), doctorId);
        } else {
            appointments = appointmentRepository.findAll();
            log.info("Found {} total appointments", appointments.size());
        }

        return appointments.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentById(Long id) {
        log.info("Fetching appointment by id: {}", id);
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return toResponse(appointment);
    }

    public AppointmentResponse createAppointment(AppointmentRequest request) {
        log.info("Creating new appointment: {}", request);

        // Set default values if not provided
        if (!hasText(request.getStatus())) {
            request.setStatus("PENDING");
        }
        if (!hasText(request.getLocation())) {
            request.setLocation("Main Clinic");
        }
        if (!hasText(request.getBillingStatus())) {
            request.setBillingStatus("PENDING");
        }
        if (request.getFee() == null || request.getFee() <= 0) {
            request.setFee(100.0);
        }

        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .patientName(request.getPatientName())
                .doctorName(request.getDoctorName())
                .specialty(request.getSpecialty())
                .appointmentDateTime(request.getAppointmentDateTime())
                .status(request.getStatus())
                .patientEmail(request.getPatientEmail())
                .patientPhone(request.getPatientPhone())
                .location(request.getLocation())
                .notes(request.getNotes())
                .billingStatus(request.getBillingStatus())
                .fee(request.getFee())
                .reason(request.getReason())
                .symptoms(request.getSymptoms())
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        log.info("Created appointment with id: {}", saved.getId());
        return toResponse(saved);
    }

    public AppointmentResponse updateAppointment(Long id, AppointmentRequest request) {
        log.info("Updating appointment with id: {}", id);

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        appointment.setPatientId(request.getPatientId());
        appointment.setDoctorId(request.getDoctorId());
        appointment.setPatientName(request.getPatientName());
        appointment.setDoctorName(request.getDoctorName());
        appointment.setSpecialty(request.getSpecialty());
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setStatus(request.getStatus());
        appointment.setPatientEmail(request.getPatientEmail());
        appointment.setPatientPhone(request.getPatientPhone());
        appointment.setLocation(request.getLocation());
        appointment.setNotes(request.getNotes());
        appointment.setBillingStatus(hasText(request.getBillingStatus()) ? request.getBillingStatus() : appointment.getBillingStatus());
        appointment.setFee((request.getFee() == null || request.getFee() <= 0) ? appointment.getFee() : request.getFee());
        appointment.setReason(request.getReason());
        appointment.setSymptoms(request.getSymptoms());

        Appointment updated = appointmentRepository.save(appointment);
        log.info("Updated appointment with id: {}", id);
        return toResponse(updated);
    }

    public void deleteAppointment(Long id) {
        log.info("Deleting appointment with id: {}", id);
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
        log.info("Deleted appointment with id: {}", id);
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatientId())
                .doctorId(appointment.getDoctorId())
                .patientName(appointment.getPatientName())
                .doctorName(appointment.getDoctorName())
                .specialty(appointment.getSpecialty())
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .status(appointment.getStatus())
                .patientEmail(appointment.getPatientEmail())
                .patientPhone(appointment.getPatientPhone())
                .location(appointment.getLocation())
                .notes(appointment.getNotes())
                .billingStatus(appointment.getBillingStatus())
                .fee(appointment.getFee())
                .reason(appointment.getReason())
                .symptoms(appointment.getSymptoms())
                .build();
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
