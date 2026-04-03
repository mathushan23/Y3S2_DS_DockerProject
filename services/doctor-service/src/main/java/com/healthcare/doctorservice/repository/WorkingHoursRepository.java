package com.healthcare.doctorservice.repository;

import com.healthcare.doctorservice.entity.WorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkingHoursRepository extends JpaRepository<WorkingHours, Long> {
    List<WorkingHours> findByDoctorId(Long doctorId);
    void deleteByDoctorId(Long doctorId);
}
