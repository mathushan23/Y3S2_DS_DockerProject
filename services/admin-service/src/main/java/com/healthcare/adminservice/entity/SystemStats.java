package com.healthcare.adminservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "system_stats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String statKey;
    private String statValue;
    private String description;
}
