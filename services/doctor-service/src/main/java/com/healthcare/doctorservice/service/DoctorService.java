package com.healthcare.doctorservice.service;

import com.healthcare.doctorservice.dto.DoctorRequest;
import com.healthcare.doctorservice.dto.DoctorResponse;
import com.healthcare.doctorservice.dto.QualificationDTO;
import com.healthcare.doctorservice.dto.WorkingHoursDTO;
import com.healthcare.doctorservice.entity.Doctor;
import com.healthcare.doctorservice.entity.Qualification;
import com.healthcare.doctorservice.entity.WorkingHours;
import com.healthcare.doctorservice.exception.ResourceNotFoundException;
import com.healthcare.doctorservice.repository.DoctorRepository;
import com.healthcare.doctorservice.repository.QualificationRepository;
import com.healthcare.doctorservice.repository.WorkingHoursRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final WorkingHoursRepository workingHoursRepository;
    private final QualificationRepository qualificationRepository;

    public DoctorService(DoctorRepository doctorRepository, 
                         WorkingHoursRepository workingHoursRepository,
                         QualificationRepository qualificationRepository) {
        this.doctorRepository = doctorRepository;
        this.workingHoursRepository = workingHoursRepository;
        this.qualificationRepository = qualificationRepository;
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream().map(this::toResponse).toList();
    }

    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return toResponse(doctor);
    }

    public DoctorResponse createDoctor(DoctorRequest request) {
        Doctor doctor = toEntity(request);
        Doctor savedDoctor = doctorRepository.save(doctor);
        
        saveWorkingHours(savedDoctor.getId(), request.getWorkingHours());
        saveQualifications(savedDoctor.getId(), request.getQualifications());
        
        return toResponse(savedDoctor);
    }

    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        
        updateDoctorEntity(doctor, request);
        Doctor updatedDoctor = doctorRepository.save(doctor);
        
        saveWorkingHours(updatedDoctor.getId(), request.getWorkingHours());
        saveQualifications(updatedDoctor.getId(), request.getQualifications());
        
        return toResponse(updatedDoctor);
    }

    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        workingHoursRepository.deleteByDoctorId(id);
        qualificationRepository.deleteByDoctorId(id);
        doctorRepository.deleteById(id);
    }

    private void saveWorkingHours(Long doctorId, List<WorkingHoursDTO> dtos) {
        if (dtos == null) return;
        workingHoursRepository.deleteByDoctorId(doctorId);
        List<WorkingHours> hours = dtos.stream().map(dto -> WorkingHours.builder()
                .doctorId(doctorId)
                .day(dto.getDay())
                .start(dto.getStart())
                .end(dto.getEnd())
                .isAvailable(dto.isAvailable())
                .build()).toList();
        workingHoursRepository.saveAll(hours);
    }

    private void saveQualifications(Long doctorId, List<QualificationDTO> dtos) {
        if (dtos == null) return;
        qualificationRepository.deleteByDoctorId(doctorId);
        List<Qualification> qualifications = dtos.stream().map(dto -> Qualification.builder()
                .doctorId(doctorId)
                .degree(dto.getDegree())
                .institution(dto.getInstitution())
                .year(dto.getYear())
                .status(dto.getStatus())
                .build()).toList();
        qualificationRepository.saveAll(qualifications);
    }

    private Doctor toEntity(DoctorRequest request) {
        return Doctor.builder()
                .id(request.getId())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .specialty(request.getSpecialty())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .experience(request.getExperience())
                .hospitalName(request.getHospitalName())
                .clinicName(request.getClinicName())
                .consultationFee(request.getConsultationFee())
                .emergencyFee(request.getEmergencyFee())
                .bio(request.getBio())
                .licenseNumber(request.getLicenseNumber())
                .licenseExpiry(request.getLicenseExpiry())
                .verificationStatus(request.getVerificationStatus())
                .boardCertified(request.isBoardCertified())
                .profilePhotoUrl(request.getProfilePhotoUrl())
                .build();
    }

    private void updateDoctorEntity(Doctor doctor, DoctorRequest request) {
        doctor.setFullName(request.getFullName());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());
        doctor.setSpecialty(request.getSpecialty());
        doctor.setAddress(request.getAddress());
        doctor.setDateOfBirth(request.getDateOfBirth());
        doctor.setGender(request.getGender());
        doctor.setExperience(request.getExperience());
        doctor.setHospitalName(request.getHospitalName());
        doctor.setClinicName(request.getClinicName());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setEmergencyFee(request.getEmergencyFee());
        doctor.setBio(request.getBio());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setLicenseExpiry(request.getLicenseExpiry());
        doctor.setVerificationStatus(request.getVerificationStatus());
        doctor.setBoardCertified(request.isBoardCertified());
        doctor.setProfilePhotoUrl(request.getProfilePhotoUrl());
    }

    private DoctorResponse toResponse(Doctor doctor) {
        List<WorkingHoursDTO> hours = workingHoursRepository.findByDoctorId(doctor.getId())
                .stream().map(h -> WorkingHoursDTO.builder()
                        .day(h.getDay())
                        .start(h.getStart())
                        .end(h.getEnd())
                        .isAvailable(h.isAvailable())
                        .build()).toList();
        
        List<QualificationDTO> qualifications = qualificationRepository.findByDoctorId(doctor.getId())
                .stream().map(q -> QualificationDTO.builder()
                        .degree(q.getDegree())
                        .institution(q.getInstitution())
                        .year(q.getYear())
                        .status(q.getStatus())
                        .build()).toList();

        return DoctorResponse.builder()
                .id(doctor.getId())
                .fullName(doctor.getFullName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialty(doctor.getSpecialty())
                .address(doctor.getAddress())
                .dateOfBirth(doctor.getDateOfBirth())
                .gender(doctor.getGender())
                .experience(doctor.getExperience())
                .hospitalName(doctor.getHospitalName())
                .clinicName(doctor.getClinicName())
                .consultationFee(doctor.getConsultationFee())
                .emergencyFee(doctor.getEmergencyFee())
                .bio(doctor.getBio())
                .licenseNumber(doctor.getLicenseNumber())
                .licenseExpiry(doctor.getLicenseExpiry())
                .verificationStatus(doctor.getVerificationStatus())
                .boardCertified(doctor.isBoardCertified())
                .profilePhotoUrl(doctor.getProfilePhotoUrl())
                .workingHours(hours)
                .qualifications(qualifications)
                .totalPatients(doctor.getTotalPatients())
                .successfulTreatments(doctor.getSuccessfulTreatments())
                .satisfactionRate(doctor.getSatisfactionRate())
                .averageRating(doctor.getAverageRating())
                .totalReviews(doctor.getTotalReviews())
                .build();
    }
}
