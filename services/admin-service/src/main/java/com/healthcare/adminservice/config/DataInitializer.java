package com.healthcare.adminservice.config;

import com.healthcare.adminservice.entity.SystemStats;
import com.healthcare.adminservice.repository.SystemStatsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SystemStatsRepository repository;

    public DataInitializer(SystemStatsRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            List<SystemStats> initialStats = List.of(
                SystemStats.builder().statKey("total_patients").statValue("1280").description("Total registered patients").build(),
                SystemStats.builder().statKey("active_doctors").statValue("48").description("Doctors currently online").build(),
                SystemStats.builder().statKey("total_appointments").statValue("3456").description("Lifetime appointments").build(),
                SystemStats.builder().statKey("platform_usage").statValue("92%").description("Current system load and usage").build()
            );
            repository.saveAll(initialStats);
            System.out.println("Admin system stats seeded successfully.");
        }
    }
}
