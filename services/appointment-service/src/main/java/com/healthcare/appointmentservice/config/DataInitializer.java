package com.healthcare.appointmentservice.config;

import com.healthcare.appointmentservice.entity.Appointment;
import com.healthcare.appointmentservice.repository.AppointmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    private final AppointmentRepository appointmentRepository;

    public DataInitializer(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public void run(String... args) {
        long count = appointmentRepository.count();
        log.info("Current appointment count in database: {}", count);

        if (count == 0) {
            log.info("Seeding appointments data...");

            // Doctor IDs (from your doctor service)
            // Doctor 1: Dr. Sarah Wilson (Cardiology)
            // Doctor 2: Dr. Michael Chen (Dermatology)
            // Doctor 3: Dr. Emily Brown (Pediatrics)
            // Doctor 4: Dr. James Aris (Neurology)

            // Patient IDs (from your patient service)
            // Patient 2: John Doe
            // Patient 3: Jane Smith
            // Patient 5: Mike Johnson
            // Patient 6: Sarah Williams
            // Patient 7: Robert Brown

            // 1. PENDING appointment - John Doe with Dr. Sarah Wilson (Cardiology)
            Appointment app1 = Appointment.builder()
                    .patientId(2L)
                    .patientName("John Doe")
                    .patientEmail("john.doe@example.com")
                    .patientPhone("+1 (555) 123-4567")
                    .doctorId(1L)
                    .doctorName("Dr. Sarah Wilson")
                    .specialty("Cardiology")
                    .location("Heart Center - Room 101")
                    .appointmentDateTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0))
                    .status("PENDING")
                    .notes("Follow-up appointment for blood pressure check. Patient reports occasional dizziness.")
                    .billingStatus("PENDING")
                    .fee(150.0)
                    .build();

            // 2. CONFIRMED appointment - John Doe with Dr. James Aris (Neurology)
            Appointment app2 = Appointment.builder()
                    .patientId(2L)
                    .patientName("John Doe")
                    .patientEmail("john.doe@example.com")
                    .patientPhone("+1 (555) 123-4567")
                    .doctorId(4L)
                    .doctorName("Dr. James Aris")
                    .specialty("Neurology")
                    .location("Neuroscience Center - Room 205")
                    .appointmentDateTime(LocalDateTime.now().plusDays(2).withHour(14).withMinute(30))
                    .status("CONFIRMED")
                    .notes("Chronic headaches evaluation. MRI recommended.")
                    .billingStatus("PAID")
                    .fee(250.0)
                    .build();

            // 3. COMPLETED appointment - Jane Smith with Dr. James Aris
            Appointment app3 = Appointment.builder()
                    .patientId(3L)
                    .patientName("Jane Smith")
                    .patientEmail("jane.smith@example.com")
                    .patientPhone("+1 (555) 234-5678")
                    .doctorId(4L)
                    .doctorName("Dr. James Aris")
                    .specialty("Neurology")
                    .location("Neuroscience Center - Room 205")
                    .appointmentDateTime(LocalDateTime.now().minusDays(2).withHour(11).withMinute(0))
                    .status("COMPLETED")
                    .notes("Follow-up on MRI results. Patient showed improvement.")
                    .billingStatus("PAID")
                    .fee(200.0)
                    .build();

            // 4. PENDING - Mike Johnson with Dr. Sarah Wilson
            Appointment app4 = Appointment.builder()
                    .patientId(5L)
                    .patientName("Mike Johnson")
                    .patientEmail("mike.johnson@example.com")
                    .patientPhone("+1 (555) 345-6789")
                    .doctorId(1L)
                    .doctorName("Dr. Sarah Wilson")
                    .specialty("Cardiology")
                    .location("Heart Center - Room 101")
                    .appointmentDateTime(LocalDateTime.now().plusDays(3).withHour(9).withMinute(0))
                    .status("PENDING")
                    .notes("Chest pain consultation. EKG recommended.")
                    .billingStatus("PENDING")
                    .fee(150.0)
                    .build();

            // 5. CONFIRMED - Sarah Williams with Dr. Michael Chen (Dermatology)
            Appointment app5 = Appointment.builder()
                    .patientId(6L)
                    .patientName("Sarah Williams")
                    .patientEmail("sarah.williams@example.com")
                    .patientPhone("+1 (555) 456-7890")
                    .doctorId(2L)
                    .doctorName("Dr. Michael Chen")
                    .specialty("Dermatology")
                    .location("Skin Care Clinic - Room 302")
                    .appointmentDateTime(LocalDateTime.now().plusDays(1).withHour(15).withMinute(0))
                    .status("CONFIRMED")
                    .notes("Skin rash evaluation. Possible allergic reaction.")
                    .billingStatus("PAID")
                    .fee(180.0)
                    .build();

            // 6. COMPLETED - Robert Brown with Dr. Emily Brown (Pediatrics)
            Appointment app6 = Appointment.builder()
                    .patientId(7L)
                    .patientName("Robert Brown")
                    .patientEmail("robert.brown@example.com")
                    .patientPhone("+1 (555) 567-8901")
                    .doctorId(3L)
                    .doctorName("Dr. Emily Brown")
                    .specialty("Pediatrics")
                    .location("Children's Health Center - Room 150")
                    .appointmentDateTime(LocalDateTime.now().minusDays(5).withHour(10).withMinute(30))
                    .status("COMPLETED")
                    .notes("Annual checkup. Vaccinations administered.")
                    .billingStatus("PAID")
                    .fee(120.0)
                    .build();

            // 7. CANCELLED appointment - John Doe with Dr. Michael Chen
            Appointment app7 = Appointment.builder()
                    .patientId(2L)
                    .patientName("John Doe")
                    .patientEmail("john.doe@example.com")
                    .patientPhone("+1 (555) 123-4567")
                    .doctorId(2L)
                    .doctorName("Dr. Michael Chen")
                    .specialty("Dermatology")
                    .location("Skin Care Clinic - Room 302")
                    .appointmentDateTime(LocalDateTime.now().plusDays(4).withHour(11).withMinute(0))
                    .status("CANCELLED")
                    .notes("Patient cancelled - rescheduled for next week")
                    .billingStatus("REFUNDED")
                    .fee(180.0)
                    .build();

            // 8. PENDING - Another appointment for Dr. Emily Brown
            Appointment app8 = Appointment.builder()
                    .patientId(3L)
                    .patientName("Jane Smith")
                    .patientEmail("jane.smith@example.com")
                    .patientPhone("+1 (555) 234-5678")
                    .doctorId(3L)
                    .doctorName("Dr. Emily Brown")
                    .specialty("Pediatrics")
                    .location("Children's Health Center - Room 150")
                    .appointmentDateTime(LocalDateTime.now().plusDays(5).withHour(13).withMinute(0))
                    .status("PENDING")
                    .notes("Child's vaccination appointment")
                    .billingStatus("PENDING")
                    .fee(120.0)
                    .build();

            // 9. CONFIRMED - Telemedicine appointment
            Appointment app9 = Appointment.builder()
                    .patientId(5L)
                    .patientName("Mike Johnson")
                    .patientEmail("mike.johnson@example.com")
                    .patientPhone("+1 (555) 345-6789")
                    .doctorId(1L)
                    .doctorName("Dr. Sarah Wilson")
                    .specialty("Cardiology")
                    .location("Telemedicine")
                    .appointmentDateTime(LocalDateTime.now().plusDays(1).withHour(16).withMinute(0))
                    .status("CONFIRMED")
                    .notes("Virtual consultation for medication review")
                    .billingStatus("PAID")
                    .fee(100.0)
                    .build();

            // 10. COMPLETED - Past appointment for review
            Appointment app10 = Appointment.builder()
                    .patientId(6L)
                    .patientName("Sarah Williams")
                    .patientEmail("sarah.williams@example.com")
                    .patientPhone("+1 (555) 456-7890")
                    .doctorId(2L)
                    .doctorName("Dr. Michael Chen")
                    .specialty("Dermatology")
                    .location("Skin Care Clinic - Room 302")
                    .appointmentDateTime(LocalDateTime.now().minusDays(10).withHour(9).withMinute(0))
                    .status("COMPLETED")
                    .notes("Acne treatment follow-up")
                    .billingStatus("PAID")
                    .fee(180.0)
                    .build();

            appointmentRepository.save(app1);
            appointmentRepository.save(app2);
            appointmentRepository.save(app3);
            appointmentRepository.save(app4);
            appointmentRepository.save(app5);
            appointmentRepository.save(app6);
            appointmentRepository.save(app7);
            appointmentRepository.save(app8);
            appointmentRepository.save(app9);
            appointmentRepository.save(app10);

            log.info("✅ Successfully seeded {} appointments!", appointmentRepository.count());
            log.info("Appointments seeded with various statuses: PENDING, CONFIRMED, COMPLETED, CANCELLED");
            log.info("Appointments assigned to doctors with IDs: 1, 2, 3, 4");
            log.info("Appointments assigned to patients with IDs: 2, 3, 5, 6, 7");
        } else {
            log.info("Database already contains {} appointments. No seeding needed.", count);
        }
    }
}