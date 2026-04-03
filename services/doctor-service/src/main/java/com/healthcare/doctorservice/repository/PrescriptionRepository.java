package com.healthcare.doctorservice.repository;

import com.healthcare.doctorservice.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByDoctorId(Long doctorId);
    List<Prescription> findByPatientId(Long patientId);
    List<Prescription> findByPatientEmail(String email);
}
