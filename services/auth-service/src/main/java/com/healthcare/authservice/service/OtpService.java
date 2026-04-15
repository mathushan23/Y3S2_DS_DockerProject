package com.healthcare.authservice.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.authservice.exception.InvalidPhoneNumberException;
import com.healthcare.authservice.exception.OtpExpiredException;
import com.healthcare.authservice.exception.OtpInvalidException;
import com.healthcare.authservice.exception.OtpRateLimitedException;
import com.healthcare.authservice.exception.TwilioVerifyConfigurationException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class OtpService {
    private static final String VERIFY_BASE_URL = "https://verify.twilio.com/v2/Services/%s";
    private static final String CHANNEL_SMS = "sms";
    private static final Pattern E164 = Pattern.compile("^\\+[1-9]\\d{7,14}$");

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.verify.service.sid}")
    private String verifyServiceSid;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @PostConstruct
    public void init() {
        if (accountSid == null || accountSid.isBlank()
                || authToken == null || authToken.isBlank()
                || verifyServiceSid == null || verifyServiceSid.isBlank()) {
            throw new TwilioVerifyConfigurationException(
                    "Twilio Verify is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID.");
        }
    }

    /**
     * Sends a verification code via Twilio Verify (SMS channel).
     */
    public void sendVerification(String phoneNumber) {
        String to = normalizePhoneNumberToE164(phoneNumber);

        String url = String.format(VERIFY_BASE_URL, verifyServiceSid) + "/Verifications";
        HttpHeaders headers = buildAuthHeaders();

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("To", to);
        form.add("Channel", CHANNEL_SMS);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(form, headers);
        try {
            restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
        } catch (HttpClientErrorException e) {
            handleTwilioSendError(e);
        }
    }

    /**
     * Verifies the user-provided code via Twilio Verify.
     * Throws specific exceptions for expired codes, wrong codes, and rate limiting.
     */
    public void verifyCode(String phoneNumber, String code) {
        String to = normalizePhoneNumberToE164(phoneNumber);

        if (code == null || !code.matches("\\d{4,10}")) {
            throw new OtpInvalidException("Invalid verification code format.");
        }

        String url = String.format(VERIFY_BASE_URL, verifyServiceSid) + "/VerificationCheck";
        HttpHeaders headers = buildAuthHeaders();

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("To", to);
        form.add("Code", code);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(form, headers);

        ResponseEntity<Map> response;
        try {
            response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
        } catch (HttpClientErrorException e) {
            handleTwilioVerifyError(e);
            throw new OtpInvalidException("Invalid or expired verification code.");
        }

        Map<String, Object> body = response.getBody();
        String status = body != null ? (String) body.get("status") : null;

        if ("approved".equalsIgnoreCase(status)) {
            return;
        }
        if ("expired".equalsIgnoreCase(status)) {
            throw new OtpExpiredException("Your verification code has expired. Please request a new one.");
        }
        if ("max_attempts_reached".equalsIgnoreCase(status)) {
            throw new OtpRateLimitedException("Too many verification attempts. Please try again later.");
        }
        if ("failed".equalsIgnoreCase(status)
                || "canceled".equalsIgnoreCase(status)
                || "deleted".equalsIgnoreCase(status)
                || "pending".equalsIgnoreCase(status)) {
            throw new OtpInvalidException("Invalid verification code.");
        }

        throw new OtpInvalidException("Invalid or expired verification code.");
    }

    public String normalizePhoneNumberToE164(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new InvalidPhoneNumberException("Phone number is required.");
        }

        String input = phoneNumber.trim();

        // Handle leading 00 (international format) by converting to +.
        if (input.startsWith("00")) {
            input = "+" + input.substring(2);
        }

        // Strip spaces, dashes, parentheses, etc. Keep an optional leading '+'.
        if (input.startsWith("+")) {
            String digits = input.substring(1).replaceAll("[^0-9]", "");
            String e164 = "+" + digits;
            if (E164.matcher(e164).matches()) {
                return e164;
            }
        } else {
            // If user omits '+', we try to interpret it as a full country number.
            String digits = input.replaceAll("[^0-9]", "");
            String e164 = "+" + digits;
            if (E164.matcher(e164).matches()) {
                return e164;
            }
        }

        throw new InvalidPhoneNumberException("Invalid phone number format. Use E.164 (example: +14155552671).");
    }

    private HttpHeaders buildAuthHeaders() {
        String auth = accountSid + ":" + authToken;
        String basic = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + basic);
        return headers;
    }

    private void handleTwilioSendError(HttpClientErrorException e) {
        int statusCode = e.getStatusCode().value();
        if (statusCode == 400) {
            throw new InvalidPhoneNumberException(extractTwilioMessage(e));
        }
        if (statusCode == 429) {
            throw new OtpRateLimitedException("Too many verification requests. Please try again later.");
        }
        throw new TwilioVerifyConfigurationException("Twilio Verify error while sending verification code: " + extractTwilioMessage(e));
    }

    private void handleTwilioVerifyError(HttpClientErrorException e) {
        int statusCode = e.getStatusCode().value();
        if (statusCode == 429) {
            throw new OtpRateLimitedException("Too many verification attempts. Please try again later.");
        }
        if (statusCode == 400) {
            throw new OtpInvalidException(extractTwilioMessage(e));
        }
        throw new TwilioVerifyConfigurationException("Twilio Verify error while verifying code: " + extractTwilioMessage(e));
    }

    private String extractTwilioMessage(HttpClientErrorException e) {
        String body = e.getResponseBodyAsString();
        if (body == null || body.isBlank()) {
            return e.getMessage();
        }

        try {
            Map<String, Object> json = objectMapper.readValue(body, new TypeReference<Map<String, Object>>() {});
            Object message = json.get("message");
            if (message != null) {
                return message.toString();
            }
        } catch (Exception ignored) {
            // fall through
        }
        return e.getMessage();
    }
}
