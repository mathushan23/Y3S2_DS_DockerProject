package com.healthcare.telemedicineservice.repository;

import com.healthcare.telemedicineservice.entity.TelemedicineSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TelemedicineRepository extends JpaRepository<TelemedicineSession, Long> {
}
