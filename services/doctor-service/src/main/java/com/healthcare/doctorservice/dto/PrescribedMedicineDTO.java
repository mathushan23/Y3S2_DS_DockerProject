package com.healthcare.doctorservice.dto;

public class PrescribedMedicineDTO {
    private String name;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;

    public PrescribedMedicineDTO() {}

    public PrescribedMedicineDTO(String name, String dosage, String frequency, String duration, String instructions) {
        this.name = name;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.instructions = instructions;
    }

    public static PrescribedMedicineDTOBuilder builder() {
        return new PrescribedMedicineDTOBuilder();
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public static class PrescribedMedicineDTOBuilder {
        private String name;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;

        public PrescribedMedicineDTOBuilder name(String name) { this.name = name; return this; }
        public PrescribedMedicineDTOBuilder dosage(String dosage) { this.dosage = dosage; return this; }
        public PrescribedMedicineDTOBuilder frequency(String frequency) { this.frequency = frequency; return this; }
        public PrescribedMedicineDTOBuilder duration(String duration) { this.duration = duration; return this; }
        public PrescribedMedicineDTOBuilder instructions(String instructions) { this.instructions = instructions; return this; }

        public PrescribedMedicineDTO build() {
            return new PrescribedMedicineDTO(name, dosage, frequency, duration, instructions);
        }
    }
}
