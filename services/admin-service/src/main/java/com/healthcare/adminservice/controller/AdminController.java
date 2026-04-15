package com.healthcare.adminservice.controller;

import com.healthcare.adminservice.entity.SystemStats;
import com.healthcare.adminservice.repository.SystemStatsRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final SystemStatsRepository repository;

    public AdminController(SystemStatsRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Admin Service is up and running!";
    }

    @GetMapping("/dashboard/stats")
    public Map<String, Object> getDashboardStats() {
        List<SystemStats> statsList = repository.findAll();
        Map<String, Object> stats = new HashMap<>();
        
        // Convert list to map
        for (SystemStats s : statsList) {
            // Convert statValue to proper type if it looks like a number
            String val = s.getStatValue();
            if (val.endsWith("%")) {
                stats.put(camelCase(s.getStatKey()), val);
            } else {
                try {
                    stats.put(camelCase(s.getStatKey()), Integer.parseInt(val));
                } catch (NumberFormatException e) {
                    stats.put(camelCase(s.getStatKey()), val);
                }
            }
        }
        
        // Default values if DB is empty
        if (stats.isEmpty()) {
            stats.put("totalPatients", 0);
            stats.put("activeDoctors", 0);
            stats.put("totalAppointments", 0);
            stats.put("platformUsage", "0%");
        }
        
        return stats;
    }
    
    private String camelCase(String key) {
        String[] parts = key.split("_");
        StringBuilder sb = new StringBuilder(parts[0]);
        for (int i = 1; i < parts.length; i++) {
            sb.append(Character.toUpperCase(parts[i].charAt(0)))
              .append(parts[i].substring(1));
        }
        return sb.toString();
    }
}
