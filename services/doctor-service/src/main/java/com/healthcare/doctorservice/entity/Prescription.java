package com.healthcare.doctorservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String doctorName;
    private Long doctorId;
    private String diagnosis;
    private String notes;
    private String status;
    private LocalDateTime createdAt;
    private String validUntil;
    private int refills;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "prescription_id")
    private List<PrescribedMedicine> medicines = new ArrayList<>();

    public Prescription() {}

    public Prescription(Long id, Long patientId, String patientName, String patientEmail, String doctorName, Long doctorId, String diagnosis, String notes, String status, LocalDateTime createdAt, String validUntil, int refills, List<PrescribedMedicine> medicines) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientEmail = patientEmail;
        this.doctorName = doctorName;
        this.doctorId = doctorId;
        this.diagnosis = diagnosis;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
        this.validUntil = validUntil;
        this.refills = refills;
        this.medicines = medicines;
    }

    public static PrescriptionBuilder builder() {
        return new PrescriptionBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getValidUntil() { return validUntil; }
    public void setValidUntil(String validUntil) { this.validUntil = validUntil; }
    public int getRefills() { return refills; }
    public void setRefills(int refills) { this.refills = refills; }
    public List<PrescribedMedicine> getMedicines() { return medicines; }
    public void setMedicines(List<PrescribedMedicine> medicines) { this.medicines = medicines; }

    public static class PrescriptionBuilder {
        private Long id;
        private Long patientId;
        private String patientName;
        private String patientEmail;
        private String doctorName;
        private Long doctorId;
        private String diagnosis;
        private String notes;
        private String status;
        private LocalDateTime createdAt;
        private String validUntil;
        private int refills;
        private List<PrescribedMedicine> medicines;

        public PrescriptionBuilder id(Long id) { this.id = id; return this; }
        public PrescriptionBuilder patientId(Long patientId) { this.patientId = patientId; return this; }
        public PrescriptionBuilder patientName(String patientName) { this.patientName = patientName; return this; }
        public PrescriptionBuilder patientEmail(String patientEmail) { this.patientEmail = patientEmail; return this; }
        public PrescriptionBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public PrescriptionBuilder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public PrescriptionBuilder diagnosis(String diagnosis) { this.diagnosis = diagnosis; return this; }
        public PrescriptionBuilder notes(String notes) { this.notes = notes; return this; }
        public PrescriptionBuilder status(String status) { this.status = status; return this; }
        public PrescriptionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PrescriptionBuilder validUntil(String validUntil) { this.validUntil = validUntil; return this; }
        public PrescriptionBuilder refills(int refills) { this.refills = refills; return this; }
        public PrescriptionBuilder medicines(List<PrescribedMedicine> medicines) { this.medicines = medicines; return this; }

        public Prescription build() {
            return new Prescription(id, patientId, patientName, patientEmail, doctorName, doctorId, diagnosis, notes, status, createdAt, validUntil, refills, medicines);
        }
    }
}
