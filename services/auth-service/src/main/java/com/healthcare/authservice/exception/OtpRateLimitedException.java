package com.healthcare.authservice.exception;

public class OtpRateLimitedException extends RuntimeException {
    public OtpRateLimitedException(String message) {
        super(message);
    }
}

