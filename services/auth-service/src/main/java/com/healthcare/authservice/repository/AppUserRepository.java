package com.healthcare.authservice.repository;

import com.healthcare.authservice.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByPhoneNumber(String phoneNumber);

    Optional<AppUser> findByEmailOrPhoneNumber(String email, String phoneNumber);
}
