package com.healthcare.authservice.service;

import com.twilio.Twilio;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.verify.service.sid}")
    private String verifyServiceSid;

    @PostConstruct
    public void init() {
        if (!"your_account_sid".equals(accountSid)) {
            Twilio.init(accountSid, authToken);
        }
    }

    /**
     * Sends a verification code via Twilio Verify.
     * Automatically detects whether to use SMS or Email channel.
     */
    public void sendVerification(String to) {
        if ("your_account_sid".equals(accountSid) || "your_verify_service_id".equals(verifyServiceSid)) {
            System.out.println("DEBUG: Twilio Verify not configured. Mocking verification for: " + to);
            return;
        }

        String channel = determineChannel(to);
        
        try {
            Verification.creator(verifyServiceSid, to, channel).create();
        } catch (Exception e) {
            System.err.println("Failed to send Twilio Verification: " + e.getMessage());
            throw new RuntimeException("Could not send verification code. Please check the identifier format.");
        }
    }

    /**
     * Verifies the code provided by the user via Twilio Verify.
     */
    public boolean verifyCheck(String to, String code) {
        if ("your_account_sid".equals(accountSid) || "your_verify_service_id".equals(verifyServiceSid)) {
            System.out.println("DEBUG: Twilio Verify not configured. Mocking check for: " + to + " with code: " + code);
            return "123456".equals(code); // Default mock code
        }

        try {
            VerificationCheck check = VerificationCheck.creator(verifyServiceSid)
                    .setTo(to)
                    .setCode(code)
                    .create();
            return "approved".equals(check.getStatus());
        } catch (Exception e) {
            System.err.println("Failed to check Twilio Verification: " + e.getMessage());
            return false;
        }
    }

    /**
     * Detects channel based on identifier format.
     */
    private String determineChannel(String identifier) {
        if (identifier.contains("@")) {
            return "email";
        }
        // Basic check for numeric/plus sign
        if (identifier.matches("^\\+?[0-9]{10,15}$")) {
            return "sms";
        }
        throw new IllegalArgumentException("Invalid identifier format. Must be an email or a valid phone number.");
    }
}
