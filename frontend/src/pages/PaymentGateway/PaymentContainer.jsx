import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useLocation } from 'react-router-dom';
import './PaymentGateway.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentContainer = () => {
    const [clientSecret, setClientSecret] = useState("");
    const location = useLocation();

    const amount = location.state?.amount || 5000;
    const appointmentId = location.state?.appointmentId || "N/A";

    useEffect(() => {
        fetch("http://localhost:8080/api/payments/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => console.error("Error creating payment intent:", err));
    }, [amount]);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0d6efd',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="payment-container">
            <div className="payment-form-card">
                <h2>Complete Your Payment</h2>
                <p>Appointment ID: {appointmentId}</p>
                <p>Amount: ${(amount / 100).toFixed(2)}</p>
                {clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm amount={amount} />
                    </Elements>
                ) : (
                    <div className="loading-spinner">Loading payment gateway...</div>
                )}
            </div>
        </div>
    );
};

export default PaymentContainer;
