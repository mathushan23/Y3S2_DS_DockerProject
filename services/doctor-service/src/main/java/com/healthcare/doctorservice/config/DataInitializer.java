package com.healthcare.doctorservice.config;

import com.healthcare.doctorservice.entity.Doctor;
import com.healthcare.doctorservice.entity.PrescribedMedicine;
import com.healthcare.doctorservice.entity.Prescription;
import com.healthcare.doctorservice.entity.Qualification;
import com.healthcare.doctorservice.entity.WorkingHours;
import com.healthcare.doctorservice.repository.DoctorRepository;
import com.healthcare.doctorservice.repository.PrescriptionRepository;
import com.healthcare.doctorservice.repository.QualificationRepository;
import com.healthcare.doctorservice.repository.WorkingHoursRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DoctorRepository doctorRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final QualificationRepository qualificationRepository;
    private final WorkingHoursRepository workingHoursRepository;

    public DataInitializer(DoctorRepository doctorRepository,
            PrescriptionRepository prescriptionRepository,
            QualificationRepository qualificationRepository,
            WorkingHoursRepository workingHoursRepository) {
        this.doctorRepository = doctorRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.qualificationRepository = qualificationRepository;
        this.workingHoursRepository = workingHoursRepository;
    }

    @Override
    public void run(String... args) {
        if (doctorRepository.count() == 0) {
            Doctor doctor = Doctor.builder()
                    .id(1L)
                    .firstName("Sarah")
                    .lastName("Wilson")
                    .email("sarah.wilson@medical.com")
                    .phone("+1 (555) 123-4567")
                    .specialty("Cardiology")
                    .address("123 Medical Center Blvd, Healthcare City, HC 12345")
                    .dateOfBirth("1978-05-15")
                    .gender("Female")
                    .experience(18)
                    .hospitalName("City General Hospital")
                    .clinicName("Wilson Heart Clinic")
                    .consultationFee(150.0)
                    .emergencyFee(250.0)
                    .bio("Dr. Sarah Wilson is a board-certified cardiologist with over 18 years of experience. She specializes in interventional cardiology and preventive cardiac care.")
                    .licenseNumber("MD-CARD-2024-7890")
                    .licenseExpiry("2026-12-31")
                    .verificationStatus("verified")
                    .boardCertified(true)
                    .totalPatients(1247)
                    .successfulTreatments(2134)
                    .satisfactionRate(98.0)
                    .averageRating(4.8)
                    .totalReviews(342)
                    .build();
            doctorRepository.save(doctor);

            // Also seed for doctor ID 4 since that seems to be assigned to Sarah Wilson in
            // auth_service
            Doctor doctor4 = Doctor.builder()
                    .id(4L)
                    .firstName("Sarah")
                    .lastName("Wilson")
                    .email("sarah.wilson@medical.com")
                    .phone("+1 (555) 123-4567")
                    .specialty("Cardiology")
                    .address("123 Medical Center Blvd, Healthcare City, HC 12345")
                    .dateOfBirth("1978-05-15")
                    .gender("Female")
                    .experience(18)
                    .hospitalName("City General Hospital")
                    .clinicName("Wilson Heart Clinic")
                    .consultationFee(150.0)
                    .emergencyFee(250.0)
                    .bio("Dr. Sarah Wilson is a board-certified cardiologist with over 18 years of experience. She specializes in interventional cardiology and preventive cardiac care.")
                    .licenseNumber("MD-CARD-2024-7890")
                    .licenseExpiry("2026-12-31")
                    .verificationStatus("verified")
                    .boardCertified(true)
                    .totalPatients(1247)
                    .successfulTreatments(2134)
                    .satisfactionRate(98.0)
                    .averageRating(4.8)
                    .totalReviews(342)
                    .build();
            doctorRepository.save(doctor4);

            System.out.println("Default doctor profiles created for IDs 1 and 4.");
        }

        if (qualificationRepository.count() == 0) {
            for (Long id : List.of(1L, 4L)) {
                Qualification q1 = Qualification.builder()
                        .doctorId(id)
                        .degree("MD - Cardiology")
                        .institution("Harvard Medical School")
                        .year("2006")
                        .status("Completed")
                        .build();
                Qualification q2 = Qualification.builder()
                        .doctorId(id)
                        .degree("Fellowship in Interventional Cardiology")
                        .institution("Mayo Clinic")
                        .year("2010")
                        .status("Completed")
                        .build();
                qualificationRepository.saveAll(List.of(q1, q2));
            }
            System.out.println("Default qualifications created.");
        }

        if (workingHoursRepository.count() == 0) {
            String[] days = { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" };
            for (Long id : List.of(1L, 4L)) {
                for (String day : days) {
                    WorkingHours hours = WorkingHours.builder()
                            .doctorId(id)
                            .day(day)
                            .start("09:00")
                            .end("17:00")
                            .isAvailable(true)
                            .build();
                    workingHoursRepository.save(hours);
                }
            }
            System.out.println("Default working hours created.");
        }

        if (prescriptionRepository.count() == 0) {
            PrescribedMedicine medicine = PrescribedMedicine.builder()
                    .name("Lisinopril")
                    .dosage("10mg")
                    .frequency("Once daily")
                    .duration("30 days")
                    .instructions("Take in the morning with water")
                    .build();

            Prescription prescription = Prescription.builder()
                    .patientId(2L)
                    .patientName("John Doe")
                    .patientEmail("john.doe@example.com")
                    .doctorId(4L) // Seed for ID 4 as well
                    .doctorName("Dr. Sarah Wilson")
                    .diagnosis("Hypertension")
                    .notes("Monitor blood pressure daily")
                    .status("ACTIVE")
                    .createdAt(LocalDateTime.now())
                    .validUntil("2024-12-31")
                    .refills(1)
                    .medicines(List.of(medicine))
                    .build();

            prescriptionRepository.save(prescription);
            System.out.println("Default prescription created.");
        }
    }
}
