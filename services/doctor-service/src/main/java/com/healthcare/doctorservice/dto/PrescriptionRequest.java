package com.healthcare.doctorservice.dto;

import java.util.List;

public class PrescriptionRequest {
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String doctorName;
    private Long doctorId;
    private String diagnosis;
    private String notes;
    private String status;
    private String validUntil;
    private int refills;
    private List<PrescribedMedicineDTO> medicines;

    public PrescriptionRequest() {}

    public PrescriptionRequest(Long patientId, String patientName, String patientEmail, String doctorName, Long doctorId, String diagnosis, String notes, String status, String validUntil, int refills, List<PrescribedMedicineDTO> medicines) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientEmail = patientEmail;
        this.doctorName = doctorName;
        this.doctorId = doctorId;
        this.diagnosis = diagnosis;
        this.notes = notes;
        this.status = status;
        this.validUntil = validUntil;
        this.refills = refills;
        this.medicines = medicines;
    }

    public static PrescriptionRequestBuilder builder() {
        return new PrescriptionRequestBuilder();
    }

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
    public String getValidUntil() { return validUntil; }
    public void setValidUntil(String validUntil) { this.validUntil = validUntil; }
    public int getRefills() { return refills; }
    public void setRefills(int refills) { this.refills = refills; }
    public List<PrescribedMedicineDTO> getMedicines() { return medicines; }
    public void setMedicines(List<PrescribedMedicineDTO> medicines) { this.medicines = medicines; }

    public static class PrescriptionRequestBuilder {
        private Long patientId;
        private String patientName;
        private String patientEmail;
        private String doctorName;
        private Long doctorId;
        private String diagnosis;
        private String notes;
        private String status;
        private String validUntil;
        private int refills;
        private List<PrescribedMedicineDTO> medicines;

        public PrescriptionRequestBuilder patientId(Long patientId) { this.patientId = patientId; return this; }
        public PrescriptionRequestBuilder patientName(String patientName) { this.patientName = patientName; return this; }
        public PrescriptionRequestBuilder patientEmail(String patientEmail) { this.patientEmail = patientEmail; return this; }
        public PrescriptionRequestBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public PrescriptionRequestBuilder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public PrescriptionRequestBuilder diagnosis(String diagnosis) { this.diagnosis = diagnosis; return this; }
        public PrescriptionRequestBuilder notes(String notes) { this.notes = notes; return this; }
        public PrescriptionRequestBuilder status(String status) { this.status = status; return this; }
        public PrescriptionRequestBuilder validUntil(String validUntil) { this.validUntil = validUntil; return this; }
        public PrescriptionRequestBuilder refills(int refills) { this.refills = refills; return this; }
        public PrescriptionRequestBuilder medicines(List<PrescribedMedicineDTO> medicines) { this.medicines = medicines; return this; }

        public PrescriptionRequest build() {
            return new PrescriptionRequest(patientId, patientName, patientEmail, doctorName, doctorId, diagnosis, notes, status, validUntil, refills, medicines);
        }
    }
}
