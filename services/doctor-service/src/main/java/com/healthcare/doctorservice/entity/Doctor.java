package com.healthcare.doctorservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number", nullable = false)
    private String phone;

    @Column(name = "phone", nullable = false)
    private String legacyPhone;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private boolean verified;

    private String specialty;
    private String address;
    private String dateOfBirth;
    private String gender;
    private int experience;
    private String hospitalName;
    private String clinicName;
    private double consultationFee;
    private double emergencyFee;
    private String bio;
    private String licenseNumber;
    private String licenseExpiry;
    private String verificationStatus;
    private boolean boardCertified;
    private String profilePhotoUrl;

    private int totalPatients;
    private int successfulTreatments;
    private double satisfactionRate;
    private double averageRating;
    private int totalReviews;

    public Doctor() {}

    public Doctor(Long id, String fullName, String email, String phone, String specialty, String address,
                  String dateOfBirth, String gender, int experience, String hospitalName, String clinicName,
                  double consultationFee, double emergencyFee, String bio, String licenseNumber,
                  String licenseExpiry, String verificationStatus, boolean boardCertified, String profilePhotoUrl,
                  int totalPatients, int successfulTreatments, double satisfactionRate, double averageRating,
                  int totalReviews) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.specialty = specialty;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.experience = experience;
        this.hospitalName = hospitalName;
        this.clinicName = clinicName;
        this.consultationFee = consultationFee;
        this.emergencyFee = emergencyFee;
        this.bio = bio;
        this.licenseNumber = licenseNumber;
        this.licenseExpiry = licenseExpiry;
        this.verificationStatus = verificationStatus;
        this.boardCertified = boardCertified;
        this.profilePhotoUrl = profilePhotoUrl;
        this.totalPatients = totalPatients;
        this.successfulTreatments = successfulTreatments;
        this.satisfactionRate = satisfactionRate;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
    }

    public static DoctorBuilder builder() {
        return new DoctorBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public int getExperience() { return experience; }
    public void setExperience(int experience) { this.experience = experience; }
    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
    public String getClinicName() { return clinicName; }
    public void setClinicName(String clinicName) { this.clinicName = clinicName; }
    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }
    public double getEmergencyFee() { return emergencyFee; }
    public void setEmergencyFee(double emergencyFee) { this.emergencyFee = emergencyFee; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public String getLicenseExpiry() { return licenseExpiry; }
    public void setLicenseExpiry(String licenseExpiry) { this.licenseExpiry = licenseExpiry; }
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    public boolean isBoardCertified() { return boardCertified; }
    public void setBoardCertified(boolean boardCertified) { this.boardCertified = boardCertified; }
    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
    public int getTotalPatients() { return totalPatients; }
    public void setTotalPatients(int totalPatients) { this.totalPatients = totalPatients; }
    public int getSuccessfulTreatments() { return successfulTreatments; }
    public void setSuccessfulTreatments(int successfulTreatments) { this.successfulTreatments = successfulTreatments; }
    public double getSatisfactionRate() { return satisfactionRate; }
    public void setSatisfactionRate(double satisfactionRate) { this.satisfactionRate = satisfactionRate; }
    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }

    @PrePersist
    @PreUpdate
    private void syncLegacyColumns() {
        String normalizedFullName = fullName != null ? fullName.trim() : "";
        if (!normalizedFullName.isEmpty()) {
            String[] nameParts = normalizedFullName.split("\\s+", 2);
            this.firstName = nameParts[0];
            this.lastName = nameParts.length > 1 ? nameParts[1] : nameParts[0];
        } else {
            this.firstName = "Doctor";
            this.lastName = "Doctor";
        }

        this.verified = verificationStatus != null && verificationStatus.equalsIgnoreCase("verified");
        this.legacyPhone = (phone != null && !phone.isBlank()) ? phone : "N/A";
    }

    public static class DoctorBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String specialty;
        private String address;
        private String dateOfBirth;
        private String gender;
        private int experience;
        private String hospitalName;
        private String clinicName;
        private double consultationFee;
        private double emergencyFee;
        private String bio;
        private String licenseNumber;
        private String licenseExpiry;
        private String verificationStatus;
        private boolean boardCertified;
        private String profilePhotoUrl;
        private int totalPatients;
        private int successfulTreatments;
        private double satisfactionRate;
        private double averageRating;
        private int totalReviews;

        public DoctorBuilder id(Long id) { this.id = id; return this; }
        public DoctorBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public DoctorBuilder email(String email) { this.email = email; return this; }
        public DoctorBuilder phone(String phone) { this.phone = phone; return this; }
        public DoctorBuilder specialty(String specialty) { this.specialty = specialty; return this; }
        public DoctorBuilder address(String address) { this.address = address; return this; }
        public DoctorBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public DoctorBuilder gender(String gender) { this.gender = gender; return this; }
        public DoctorBuilder experience(int experience) { this.experience = experience; return this; }
        public DoctorBuilder hospitalName(String hospitalName) { this.hospitalName = hospitalName; return this; }
        public DoctorBuilder clinicName(String clinicName) { this.clinicName = clinicName; return this; }
        public DoctorBuilder consultationFee(double consultationFee) { this.consultationFee = consultationFee; return this; }
        public DoctorBuilder emergencyFee(double emergencyFee) { this.emergencyFee = emergencyFee; return this; }
        public DoctorBuilder bio(String bio) { this.bio = bio; return this; }
        public DoctorBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public DoctorBuilder licenseExpiry(String licenseExpiry) { this.licenseExpiry = licenseExpiry; return this; }
        public DoctorBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }
        public DoctorBuilder boardCertified(boolean boardCertified) { this.boardCertified = boardCertified; return this; }
        public DoctorBuilder profilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; return this; }
        public DoctorBuilder totalPatients(int totalPatients) { this.totalPatients = totalPatients; return this; }
        public DoctorBuilder successfulTreatments(int successfulTreatments) { this.successfulTreatments = successfulTreatments; return this; }
        public DoctorBuilder satisfactionRate(double satisfactionRate) { this.satisfactionRate = satisfactionRate; return this; }
        public DoctorBuilder averageRating(double averageRating) { this.averageRating = averageRating; return this; }
        public DoctorBuilder totalReviews(int totalReviews) { this.totalReviews = totalReviews; return this; }

        public Doctor build() {
            return new Doctor(id, fullName, email, phone, specialty, address, dateOfBirth, gender, experience,
                    hospitalName, clinicName, consultationFee, emergencyFee, bio, licenseNumber, licenseExpiry,
                    verificationStatus, boardCertified, profilePhotoUrl, totalPatients, successfulTreatments,
                    satisfactionRate, averageRating, totalReviews);
        }
    }
}
