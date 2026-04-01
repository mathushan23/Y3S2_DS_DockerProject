package com.healthcare.authservice.service;

import com.healthcare.authservice.dto.LoginRequest;
import com.healthcare.authservice.dto.LoginResponse;
import com.healthcare.authservice.dto.UserRequest;
import com.healthcare.authservice.dto.UserResponse;
import com.healthcare.authservice.entity.AppUser;
import com.healthcare.authservice.entity.UserRole;
import com.healthcare.authservice.exception.InvalidCredentialsException;
import com.healthcare.authservice.exception.ResourceNotFoundException;
import com.healthcare.authservice.exception.UserAlreadyExistsException;
import com.healthcare.authservice.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final RestTemplate restTemplate;
    private final JwtService jwtService;
    private final OtpService otpService;

    @Value("${DOCTOR_SERVICE_URL:http://localhost:8083}")
    private String doctorServiceUrl;

    @Value("${PATIENT_SERVICE_URL:http://localhost:8082}")
    private String patientServiceUrl;

    public UserResponse register(UserRequest request) {
        if (appUserRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("A user with this email already exists: " + request.getEmail());
        }

        AppUser user = AppUser.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : "")
                .password(request.getPassword())
                .role(request.getRole())
                .build();

        AppUser savedUser = appUserRepository.save(user);

        // Sync with role-specific services
        try {
            if (request.getRole() == UserRole.DOCTOR) {
                createDoctorProfile(request);
            } else if (request.getRole() == UserRole.PATIENT) {
                createPatientProfile(request);
            }
        } catch (Exception e) {
            // Log error and optionally rollback auth user
            System.err.println("CRITICAL: Failed to sync with profile service for user " + request.getEmail() + ": " + e.getMessage());
        }

        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().name());
        return toResponse(savedUser, token);
    }
    
    // Forgot Password Flow
    public void forgotPassword(String identifier) {
        AppUser user = appUserRepository.findByEmailOrPhoneNumber(identifier, identifier)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + identifier));

        // Send verification (OtpService handles channel detection)
        otpService.sendVerification(identifier);
    }

    public void verifyOtp(String identifier, String code) {
        if (!otpService.verifyCheck(identifier, code)) {
            throw new InvalidCredentialsException("Invalid or expired verification code");
        }
    }

    public void resetPassword(String identifier, String newPassword) {
        AppUser user = appUserRepository.findByEmailOrPhoneNumber(identifier, identifier)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + identifier));

        user.setPassword(newPassword);
        appUserRepository.save(user);
    }

    private void createDoctorProfile(UserRequest request) {
        Map<String, Object> doctorRequest = new HashMap<>();
        doctorRequest.put("fullName", request.getFullName());
        doctorRequest.put("specialty", request.getSpecialty() != null ? request.getSpecialty() : "General");
        doctorRequest.put("email", request.getEmail());
        doctorRequest.put("phoneNumber", request.getPhoneNumber() != null ? request.getPhoneNumber() : "N/A");
        doctorRequest.put("verified", false);
        
        restTemplate.postForObject(doctorServiceUrl + "/api/doctors", doctorRequest, Object.class);
    }

    private void createPatientProfile(UserRequest request) {
        String[] nameParts = request.getFullName().split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        Map<String, Object> patientRequest = new HashMap<>();
        patientRequest.put("firstName", firstName);
        patientRequest.put("lastName", lastName);
        patientRequest.put("email", request.getEmail());
        patientRequest.put("phoneNumber", request.getPhoneNumber() != null ? request.getPhoneNumber() : "N/A");
        
        restTemplate.postForObject(patientServiceUrl + "/api/patients", patientRequest, Object.class);
    }

    public LoginResponse login(LoginRequest request) {
        AppUser user = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return LoginResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(jwtService.generateToken(user.getEmail(), user.getRole().name()))
                .message("Login successful")
                .build();
    }

    public List<UserResponse> getAllUsers() {
        return appUserRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateUser(Long id, UserRequest request) {
        AppUser user = appUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        AppUser savedUser = appUserRepository.save(user);
        String token = jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().name());
        return toResponse(savedUser, token);
    }

    public void deleteUser(Long id) {
        if (!appUserRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        appUserRepository.deleteById(id);
    }

    private UserResponse toResponse(AppUser user, String token) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .build();
    }

    private UserResponse toResponse(AppUser user) {
        return toResponse(user, null);
    }
}
