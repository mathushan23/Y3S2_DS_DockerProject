package com.healthcare.adminservice.repository;

import com.healthcare.adminservice.entity.SystemStats;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SystemStatsRepository extends JpaRepository<SystemStats, Long> {
    Optional<SystemStats> findByStatKey(String statKey);
}
