package com.healthcare.paymentservice.controller;

import com.healthcare.paymentservice.dto.PaymentRequest;
import com.healthcare.paymentservice.dto.PaymentResponse;
import com.healthcare.paymentservice.service.StripeService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private StripeService stripeService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<PaymentResponse> createPaymentIntent(@RequestBody PaymentRequest request) {
        try {
            Long amount = request.getAmount() != null ? request.getAmount() : 5000L;
            String clientSecret = stripeService.createPaymentIntent(amount);
            return ResponseEntity.ok(new PaymentResponse(clientSecret));
        } catch (StripeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}
