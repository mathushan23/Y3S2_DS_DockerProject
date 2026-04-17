package com.healthcare.paymentservice.dto;

public class PaymentRequest {
    private Long amount; // in cents
    
    public Long getAmount() { return amount; }
    public void setAmount(Long amount) { this.amount = amount; }
}
