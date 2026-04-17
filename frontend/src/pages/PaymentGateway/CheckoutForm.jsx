import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import PaymentSuccess from "./PaymentSuccess";

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required' 
        });

        if (error) {
            setMessage(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage("Payment succeeded!");
            setIsSuccess(true);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    if (isSuccess) {
        return <PaymentSuccess amount={amount} />;
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit" className="payment-submit-btn">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Loading...</div> : "Pay now"}
                </span>
            </button>
            {message && <div id="payment-message" className="error-message">{message}</div>}
        </form>
    );
};

export default CheckoutForm;
