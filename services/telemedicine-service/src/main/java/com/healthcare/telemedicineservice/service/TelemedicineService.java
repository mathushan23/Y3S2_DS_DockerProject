package com.healthcare.telemedicineservice.service;

import com.healthcare.telemedicineservice.dto.TelemedicineRequest;
import com.healthcare.telemedicineservice.dto.TelemedicineResponse;
import com.healthcare.telemedicineservice.entity.TelemedicineSession;
import com.healthcare.telemedicineservice.exception.ResourceNotFoundException;
import com.healthcare.telemedicineservice.repository.TelemedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TelemedicineService {

    private final TelemedicineRepository telemedicineRepository;

    public List<TelemedicineResponse> getAllSessions() {
        return telemedicineRepository.findAll().stream().map(this::toResponse).toList();
    }

    public TelemedicineResponse getSessionById(Long id) {
        TelemedicineSession session = telemedicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Telemedicine session not found with id: " + id));
        return toResponse(session);
    }

    public TelemedicineResponse createSession(TelemedicineRequest request) {
        TelemedicineSession session = TelemedicineSession.builder()
                .appointmentId(request.getAppointmentId())
                .patientName(request.getPatientName())
                .doctorName(request.getDoctorName())
                .meetingLink(request.getMeetingLink())
                .scheduledAt(request.getScheduledAt())
                .status(request.getStatus())
                .build();
        return toResponse(telemedicineRepository.save(session));
    }

    public TelemedicineResponse updateSession(Long id, TelemedicineRequest request) {
        TelemedicineSession session = telemedicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Telemedicine session not found with id: " + id));
        session.setAppointmentId(request.getAppointmentId());
        session.setPatientName(request.getPatientName());
        session.setDoctorName(request.getDoctorName());
        session.setMeetingLink(request.getMeetingLink());
        session.setScheduledAt(request.getScheduledAt());
        session.setStatus(request.getStatus());
        return toResponse(telemedicineRepository.save(session));
    }

    public void deleteSession(Long id) {
        if (!telemedicineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Telemedicine session not found with id: " + id);
        }
        telemedicineRepository.deleteById(id);
    }

    private TelemedicineResponse toResponse(TelemedicineSession session) {
        return TelemedicineResponse.builder()
                .id(session.getId())
                .appointmentId(session.getAppointmentId())
                .patientName(session.getPatientName())
                .doctorName(session.getDoctorName())
                .meetingLink(session.getMeetingLink())
                .scheduledAt(session.getScheduledAt())
                .status(session.getStatus())
                .build();
    }
}
