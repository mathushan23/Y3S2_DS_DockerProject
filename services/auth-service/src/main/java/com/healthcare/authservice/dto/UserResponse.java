package com.healthcare.authservice.dto;

import com.healthcare.authservice.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private UserRole role;
    private String token;
}
