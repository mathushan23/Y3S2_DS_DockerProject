package com.healthcare.patientservice.config;

import com.healthcare.patientservice.entity.Patient;
import com.healthcare.patientservice.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PatientRepository patientRepository;

    public DataInitializer(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public void run(String... args) {
        if (patientRepository.count() == 0) {
            Patient patient = Patient.builder()
                    .id(2L)
                    .firstName("John")
                    .lastName("Doe")
                    .email("john.doe@example.com")
                    .phoneNumber("+1 (555) 987-6543")
                    .address("456 Oak Lane, Heartford, HT 67890")
                    .dateOfBirth(LocalDate.of(1985, 8, 20))
                    .gender("Male")
                    .build();
            
            patientRepository.save(patient);
            System.out.println("Default patient created in patient_db.");
        }
    }
}
