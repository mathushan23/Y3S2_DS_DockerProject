package com.healthcare.doctorservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctor_working_hours")
public class WorkingHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long doctorId;
    private String day;
    private String start;
    private String end;
    private boolean available;

    public WorkingHours() {}

    public WorkingHours(Long id, Long doctorId, String day, String start, String end, boolean available) {
        this.id = id;
        this.doctorId = doctorId;
        this.day = day;
        this.start = start;
        this.end = end;
        this.available = available;
    }

    public static WorkingHoursBuilder builder() {
        return new WorkingHoursBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }
    public String getStart() { return start; }
    public void setStart(String start) { this.start = start; }
    public String getEnd() { return end; }
    public void setEnd(String end) { this.end = end; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public static class WorkingHoursBuilder {
        private Long id;
        private Long doctorId;
        private String day;
        private String start;
        private String end;
        private boolean available;

        public WorkingHoursBuilder id(Long id) { this.id = id; return this; }
        public WorkingHoursBuilder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public WorkingHoursBuilder day(String day) { this.day = day; return this; }
        public WorkingHoursBuilder start(String start) { this.start = start; return this; }
        public WorkingHoursBuilder end(String end) { this.end = end; return this; }
        public WorkingHoursBuilder isAvailable(boolean available) { this.available = available; return this; }

        public WorkingHours build() {
            return new WorkingHours(id, doctorId, day, start, end, available);
        }
    }
}
