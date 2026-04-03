package com.healthcare.doctorservice.dto;

public class WorkingHoursDTO {
    private String day;
    private String start;
    private String end;
    private boolean available;

    public WorkingHoursDTO() {}

    public WorkingHoursDTO(String day, String start, String end, boolean available) {
        this.day = day;
        this.start = start;
        this.end = end;
        this.available = available;
    }

    public static WorkingHoursDTOBuilder builder() {
        return new WorkingHoursDTOBuilder();
    }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }
    public String getStart() { return start; }
    public void setStart(String start) { this.start = start; }
    public String getEnd() { return end; }
    public void setEnd(String end) { this.end = end; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public static class WorkingHoursDTOBuilder {
        private String day;
        private String start;
        private String end;
        private boolean available;

        public WorkingHoursDTOBuilder day(String day) { this.day = day; return this; }
        public WorkingHoursDTOBuilder start(String start) { this.start = start; return this; }
        public WorkingHoursDTOBuilder end(String end) { this.end = end; return this; }
        public WorkingHoursDTOBuilder isAvailable(boolean available) { this.available = available; return this; }

        public WorkingHoursDTO build() {
            return new WorkingHoursDTO(day, start, end, available);
        }
    }
}
