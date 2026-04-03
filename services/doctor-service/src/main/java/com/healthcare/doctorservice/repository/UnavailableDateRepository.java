package com.healthcare.doctorservice.repository;

import com.healthcare.doctorservice.entity.UnavailableDate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UnavailableDateRepository extends JpaRepository<UnavailableDate, Long> {
    List<UnavailableDate> findByDoctorId(Long doctorId);
    void deleteByDoctorId(Long doctorId);
}
