import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = ({ amount }) => {
    const navigate = useNavigate();

    return (
        <div className="success-container">
            <div className="success-icon">✓</div>
            <h3>Payment Successful!</h3>
            <p>Your payment of ${(amount / 100).toFixed(2)} has been processed successfully.</p>
            <button onClick={() => navigate('/')} className="back-home-btn">
                Return to Dashboard
            </button>
        </div>
    );
};

export default PaymentSuccess;
