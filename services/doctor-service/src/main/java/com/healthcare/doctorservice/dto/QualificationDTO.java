package com.healthcare.doctorservice.dto;

public class QualificationDTO {
    private String degree;
    private String institution;
    private String year;
    private String status;

    public QualificationDTO() {}

    public QualificationDTO(String degree, String institution, String year, String status) {
        this.degree = degree;
        this.institution = institution;
        this.year = year;
        this.status = status;
    }

    public static QualificationDTOBuilder builder() {
        return new QualificationDTOBuilder();
    }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static class QualificationDTOBuilder {
        private String degree;
        private String institution;
        private String year;
        private String status;

        public QualificationDTOBuilder degree(String degree) { this.degree = degree; return this; }
        public QualificationDTOBuilder institution(String institution) { this.institution = institution; return this; }
        public QualificationDTOBuilder year(String year) { this.year = year; return this; }
        public QualificationDTOBuilder status(String status) { this.status = status; return this; }

        public QualificationDTO build() {
            return new QualificationDTO(degree, institution, year, status);
        }
    }
}
