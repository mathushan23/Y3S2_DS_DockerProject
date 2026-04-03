package com.healthcare.doctorservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "prescribed_medicines")
public class PrescribedMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;

    public PrescribedMedicine() {}

    public PrescribedMedicine(Long id, String name, String dosage, String frequency, String duration, String instructions) {
        this.id = id;
        this.name = name;
        this.dosage = dosage;
        this.frequency = frequency;
        this.duration = duration;
        this.instructions = instructions;
    }

    public static PrescribedMedicineBuilder builder() {
        return new PrescribedMedicineBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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

    public static class PrescribedMedicineBuilder {
        private Long id;
        private String name;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;

        public PrescribedMedicineBuilder id(Long id) { this.id = id; return this; }
        public PrescribedMedicineBuilder name(String name) { this.name = name; return this; }
        public PrescribedMedicineBuilder dosage(String dosage) { this.dosage = dosage; return this; }
        public PrescribedMedicineBuilder frequency(String frequency) { this.frequency = frequency; return this; }
        public PrescribedMedicineBuilder duration(String duration) { this.duration = duration; return this; }
        public PrescribedMedicineBuilder instructions(String instructions) { this.instructions = instructions; return this; }

        public PrescribedMedicine build() {
            return new PrescribedMedicine(id, name, dosage, frequency, duration, instructions);
        }
    }
}
