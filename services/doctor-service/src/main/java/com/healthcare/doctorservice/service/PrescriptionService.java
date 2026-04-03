package com.healthcare.doctorservice.service;

import com.healthcare.doctorservice.dto.PrescribedMedicineDTO;
import com.healthcare.doctorservice.dto.PrescriptionRequest;
import com.healthcare.doctorservice.dto.PrescriptionResponse;
import com.healthcare.doctorservice.entity.PrescribedMedicine;
import com.healthcare.doctorservice.entity.Prescription;
import com.healthcare.doctorservice.exception.ResourceNotFoundException;
import com.healthcare.doctorservice.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }

    public List<PrescriptionResponse> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<Prescription> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }
    
    public List<PrescriptionResponse> getPrescriptionsByEmail(String email) {
        return prescriptionRepository.findByPatientEmail(email).stream().map(this::toResponse).toList();
    }

    public PrescriptionResponse getPrescriptionById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        return toResponse(prescription);
    }

    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        Prescription prescription = Prescription.builder()
                .patientId(request.getPatientId())
                .patientName(request.getPatientName())
                .patientEmail(request.getPatientEmail())
                .doctorName(request.getDoctorName())
                .doctorId(request.getDoctorId())
                .diagnosis(request.getDiagnosis())
                .notes(request.getNotes())
                .status(request.getStatus())
                .createdAt(LocalDateTime.now())
                .validUntil(request.getValidUntil())
                .refills(request.getRefills())
                .medicines(request.getMedicines().stream().map(this::toMedicineEntity).toList())
                .build();
        return toResponse(prescriptionRepository.save(prescription));
    }

    public PrescriptionResponse updatePrescription(Long id, PrescriptionRequest request) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setNotes(request.getNotes());
        prescription.setStatus(request.getStatus());
        prescription.setValidUntil(request.getValidUntil());
        prescription.setRefills(request.getRefills());
        
        prescription.getMedicines().clear();
        prescription.getMedicines().addAll(request.getMedicines().stream().map(this::toMedicineEntity).toList());
        
        return toResponse(prescriptionRepository.save(prescription));
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }

    private PrescribedMedicine toMedicineEntity(PrescribedMedicineDTO dto) {
        return PrescribedMedicine.builder()
                .name(dto.getName())
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .duration(dto.getDuration())
                .instructions(dto.getInstructions())
                .build();
    }

    private PrescribedMedicineDTO toMedicineDto(PrescribedMedicine entity) {
        return PrescribedMedicineDTO.builder()
                .name(entity.getName())
                .dosage(entity.getDosage())
                .frequency(entity.getFrequency())
                .duration(entity.getDuration())
                .instructions(entity.getInstructions())
                .build();
    }

    private PrescriptionResponse toResponse(Prescription prescription) {
        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .patientId(prescription.getPatientId())
                .patientName(prescription.getPatientName())
                .patientEmail(prescription.getPatientEmail())
                .doctorName(prescription.getDoctorName())
                .doctorId(prescription.getDoctorId())
                .diagnosis(prescription.getDiagnosis())
                .notes(prescription.getNotes())
                .status(prescription.getStatus())
                .createdAt(prescription.getCreatedAt())
                .validUntil(prescription.getValidUntil())
                .refills(prescription.getRefills())
                .medicines(prescription.getMedicines() != null ? 
                           prescription.getMedicines().stream().map(this::toMedicineDto).toList() : null)
                .build();
    }
}
