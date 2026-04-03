package com.healthcare.doctorservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctor_qualifications")
public class Qualification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long doctorId;
    private String degree;
    private String institution;
    private String year;
    private String status;

    public Qualification() {}

    public Qualification(Long id, Long doctorId, String degree, String institution, String year, String status) {
        this.id = id;
        this.doctorId = doctorId;
        this.degree = degree;
        this.institution = institution;
        this.year = year;
        this.status = status;
    }

    public static QualificationBuilder builder() {
        return new QualificationBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static class QualificationBuilder {
        private Long id;
        private Long doctorId;
        private String degree;
        private String institution;
        private String year;
        private String status;

        public QualificationBuilder id(Long id) { this.id = id; return this; }
        public QualificationBuilder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public QualificationBuilder degree(String degree) { this.degree = degree; return this; }
        public QualificationBuilder institution(String institution) { this.institution = institution; return this; }
        public QualificationBuilder year(String year) { this.year = year; return this; }
        public QualificationBuilder status(String status) { this.status = status; return this; }

        public Qualification build() {
            return new Qualification(id, doctorId, degree, institution, year, status);
        }
    }
}
