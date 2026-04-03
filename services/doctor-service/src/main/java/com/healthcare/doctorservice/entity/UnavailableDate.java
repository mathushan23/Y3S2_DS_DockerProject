package com.healthcare.doctorservice.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "doctor_unavailable_dates")
public class UnavailableDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long doctorId;
    private LocalDate date;
    private String reason;

    public UnavailableDate() {}

    public UnavailableDate(Long id, Long doctorId, LocalDate date, String reason) {
        this.id = id;
        this.doctorId = doctorId;
        this.date = date;
        this.reason = reason;
    }

    public static UnavailableDateBuilder builder() {
        return new UnavailableDateBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public static class UnavailableDateBuilder {
        private Long id;
        private Long doctorId;
        private LocalDate date;
        private String reason;

        public UnavailableDateBuilder id(Long id) { this.id = id; return this; }
        public UnavailableDateBuilder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public UnavailableDateBuilder date(LocalDate date) { this.date = date; return this; }
        public UnavailableDateBuilder reason(String reason) { this.reason = reason; return this; }

        public UnavailableDate build() {
            return new UnavailableDate(id, doctorId, date, reason);
        }
    }
}
