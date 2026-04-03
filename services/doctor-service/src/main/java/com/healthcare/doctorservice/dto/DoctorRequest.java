package com.healthcare.doctorservice.dto;

import java.util.List;

public class DoctorRequest {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
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
    private List<WorkingHoursDTO> workingHours;
    private List<QualificationDTO> qualifications;

    public DoctorRequest() {}

    public DoctorRequest(Long id, String firstName, String lastName, String phone, String email, String specialty, String address, String dateOfBirth, String gender, int experience, String hospitalName, String clinicName, double consultationFee, double emergencyFee, String bio, String licenseNumber, String licenseExpiry, String verificationStatus, boolean boardCertified, String profilePhotoUrl, List<WorkingHoursDTO> workingHours, List<QualificationDTO> qualifications) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
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
        this.workingHours = workingHours;
        this.qualifications = qualifications;
    }

    public static DoctorRequestBuilder builder() {
        return new DoctorRequestBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
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
    public List<WorkingHoursDTO> getWorkingHours() { return workingHours; }
    public void setWorkingHours(List<WorkingHoursDTO> workingHours) { this.workingHours = workingHours; }
    public List<QualificationDTO> getQualifications() { return qualifications; }
    public void setQualifications(List<QualificationDTO> qualifications) { this.qualifications = qualifications; }

    public static class DoctorRequestBuilder {
        private Long id;
        private String firstName;
        private String lastName;
        private String phone;
        private String email;
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
        private List<WorkingHoursDTO> workingHours;
        private List<QualificationDTO> qualifications;

        public DoctorRequestBuilder id(Long id) { this.id = id; return this; }
        public DoctorRequestBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public DoctorRequestBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public DoctorRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public DoctorRequestBuilder email(String email) { this.email = email; return this; }
        public DoctorRequestBuilder specialty(String specialty) { this.specialty = specialty; return this; }
        public DoctorRequestBuilder address(String address) { this.address = address; return this; }
        public DoctorRequestBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public DoctorRequestBuilder gender(String gender) { this.gender = gender; return this; }
        public DoctorRequestBuilder experience(int experience) { this.experience = experience; return this; }
        public DoctorRequestBuilder hospitalName(String hospitalName) { this.hospitalName = hospitalName; return this; }
        public DoctorRequestBuilder clinicName(String clinicName) { this.clinicName = clinicName; return this; }
        public DoctorRequestBuilder consultationFee(double consultationFee) { this.consultationFee = consultationFee; return this; }
        public DoctorRequestBuilder emergencyFee(double emergencyFee) { this.emergencyFee = emergencyFee; return this; }
        public DoctorRequestBuilder bio(String bio) { this.bio = bio; return this; }
        public DoctorRequestBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public DoctorRequestBuilder licenseExpiry(String licenseExpiry) { this.licenseExpiry = licenseExpiry; return this; }
        public DoctorRequestBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }
        public DoctorRequestBuilder boardCertified(boolean boardCertified) { this.boardCertified = boardCertified; return this; }
        public DoctorRequestBuilder profilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; return this; }
        public DoctorRequestBuilder workingHours(List<WorkingHoursDTO> workingHours) { this.workingHours = workingHours; return this; }
        public DoctorRequestBuilder qualifications(List<QualificationDTO> qualifications) { this.qualifications = qualifications; return this; }

        public DoctorRequest build() {
            return new DoctorRequest(id, firstName, lastName, phone, email, specialty, address, dateOfBirth, gender, experience, hospitalName, clinicName, consultationFee, emergencyFee, bio, licenseNumber, licenseExpiry, verificationStatus, boardCertified, profilePhotoUrl, workingHours, qualifications);
        }
    }
}
