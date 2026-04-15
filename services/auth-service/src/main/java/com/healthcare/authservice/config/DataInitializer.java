package com.healthcare.authservice.config;

import com.healthcare.authservice.entity.AppUser;
import com.healthcare.authservice.entity.UserRole;
import com.healthcare.authservice.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AppUserRepository userRepository;

    public DataInitializer(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            AppUser sarah = AppUser.builder()
                    .fullName("Dr. Sarah Wilson")
                    .email("sarah.wilson@medical.com")
                    .phoneNumber("+15551234567")
                    .password("password123")
                    .role(UserRole.DOCTOR)
                    .build();
            userRepository.save(sarah);

            AppUser john = AppUser.builder()
                    .fullName("John Doe")
                    .email("john.doe@example.com")
                    .phoneNumber("+15550000000")
                    .password("password123")
                    .role(UserRole.PATIENT)
                    .build();
            userRepository.save(john);

            System.out.println("Default doctor and patient created in auth_db.");
        }
    }
}
