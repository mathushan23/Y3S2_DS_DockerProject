package com.healthcare.doctorservice.repository;

import com.healthcare.doctorservice.entity.Qualification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QualificationRepository extends JpaRepository<Qualification, Long> {
    List<Qualification> findByDoctorId(Long doctorId);
    void deleteByDoctorId(Long doctorId);
}
