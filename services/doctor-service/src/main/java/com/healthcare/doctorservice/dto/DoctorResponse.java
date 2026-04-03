package com.healthcare.doctorservice.dto;

import java.util.List;

public class DoctorResponse {
    private Long id;
    private String firstName;
    private String lastName;
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
    private List<WorkingHoursDTO> workingHours;
    private List<QualificationDTO> qualifications;
    private int totalPatients;
    private int successfulTreatments;
    private double satisfactionRate;
    private double averageRating;
    private int totalReviews;

    public DoctorResponse() {}

    public DoctorResponse(Long id, String firstName, String lastName, String email, String phone, String specialty, String address, String dateOfBirth, String gender, int experience, String hospitalName, String clinicName, double consultationFee, double emergencyFee, String bio, String licenseNumber, String licenseExpiry, String verificationStatus, boolean boardCertified, String profilePhotoUrl, List<WorkingHoursDTO> workingHours, List<QualificationDTO> qualifications, int totalPatients, int successfulTreatments, double satisfactionRate, double averageRating, int totalReviews) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
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
        this.workingHours = workingHours;
        this.qualifications = qualifications;
        this.totalPatients = totalPatients;
        this.successfulTreatments = successfulTreatments;
        this.satisfactionRate = satisfactionRate;
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
    }

    public static DoctorResponseBuilder builder() {
        return new DoctorResponseBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
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
    public List<WorkingHoursDTO> getWorkingHours() { return workingHours; }
    public void setWorkingHours(List<WorkingHoursDTO> workingHours) { this.workingHours = workingHours; }
    public List<QualificationDTO> getQualifications() { return qualifications; }
    public void setQualifications(List<QualificationDTO> qualifications) { this.qualifications = qualifications; }
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

    public static class DoctorResponseBuilder {
        private Long id;
        private String firstName;
        private String lastName;
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
        private List<WorkingHoursDTO> workingHours;
        private List<QualificationDTO> qualifications;
        private int totalPatients;
        private int successfulTreatments;
        private double satisfactionRate;
        private double averageRating;
        private int totalReviews;

        public DoctorResponseBuilder id(Long id) { this.id = id; return this; }
        public DoctorResponseBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public DoctorResponseBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public DoctorResponseBuilder email(String email) { this.email = email; return this; }
        public DoctorResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public DoctorResponseBuilder specialty(String specialty) { this.specialty = specialty; return this; }
        public DoctorResponseBuilder address(String address) { this.address = address; return this; }
        public DoctorResponseBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public DoctorResponseBuilder gender(String gender) { this.gender = gender; return this; }
        public DoctorResponseBuilder experience(int experience) { this.experience = experience; return this; }
        public DoctorResponseBuilder hospitalName(String hospitalName) { this.hospitalName = hospitalName; return this; }
        public DoctorResponseBuilder clinicName(String clinicName) { this.clinicName = clinicName; return this; }
        public DoctorResponseBuilder consultationFee(double consultationFee) { this.consultationFee = consultationFee; return this; }
        public DoctorResponseBuilder emergencyFee(double emergencyFee) { this.emergencyFee = emergencyFee; return this; }
        public DoctorResponseBuilder bio(String bio) { this.bio = bio; return this; }
        public DoctorResponseBuilder licenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; return this; }
        public DoctorResponseBuilder licenseExpiry(String licenseExpiry) { this.licenseExpiry = licenseExpiry; return this; }
        public DoctorResponseBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }
        public DoctorResponseBuilder boardCertified(boolean boardCertified) { this.boardCertified = boardCertified; return this; }
        public DoctorResponseBuilder profilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; return this; }
        public DoctorResponseBuilder workingHours(List<WorkingHoursDTO> workingHours) { this.workingHours = workingHours; return this; }
        public DoctorResponseBuilder qualifications(List<QualificationDTO> qualifications) { this.qualifications = qualifications; return this; }
        public DoctorResponseBuilder totalPatients(int totalPatients) { this.totalPatients = totalPatients; return this; }
        public DoctorResponseBuilder successfulTreatments(int successfulTreatments) { this.successfulTreatments = successfulTreatments; return this; }
        public DoctorResponseBuilder satisfactionRate(double satisfactionRate) { this.satisfactionRate = satisfactionRate; return this; }
        public DoctorResponseBuilder averageRating(double averageRating) { this.averageRating = averageRating; return this; }
        public DoctorResponseBuilder totalReviews(int totalReviews) { this.totalReviews = totalReviews; return this; }

        public DoctorResponse build() {
            return new DoctorResponse(id, firstName, lastName, email, phone, specialty, address, dateOfBirth, gender, experience, hospitalName, clinicName, consultationFee, emergencyFee, bio, licenseNumber, licenseExpiry, verificationStatus, boardCertified, profilePhotoUrl, workingHours, qualifications, totalPatients, successfulTreatments, satisfactionRate, averageRating, totalReviews);
        }
    }
}
