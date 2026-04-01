import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FormField } from "../components/common";
import { ArrowLeft, KeyRound, Heart, ShieldCheck, Activity } from "lucide-react";
import authBg from "../assets/auth_bg.png";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { identifier });
      navigate("/verify-otp", { state: { identifier } });
    } catch (err) {
      setError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <Heart size={64} color="#0ea5e9" fill="#0ea5e9" style={{ marginBottom: "2rem" }} />
          <h2>Smart Care for a Better Life.</h2>
          <p>Access your personal health records, book appointments, and connect with top medical professionals instantly.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <ShieldCheck size={24} color="#0ea5e9" />
              <span>Secure & HIPAA Compliant</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Activity size={24} color="#0ea5e9" />
              <span>Real-time Health Monitoring</span>
            </div>
          </div>
        </div>
        <img 
          src={authBg} 
          alt="Healthcare" 
          style={{ 
            position: "absolute", 
            bottom: "-10%", 
            right: "-10%", 
            width: "80%", 
            opacity: 0.2,
            zIndex: 0,
            transform: "rotate(-10deg)"
          }} 
        />
      </div>

      <div className="auth-form-side">
        <div className="auth-container">
          <Link to="/login" className="back-link" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", textDecoration: "none", marginBottom: "2rem", fontSize: "0.875rem" }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
          
          <div className="auth-header">
            <h1>Forgot Password</h1>
            <p className="lead">Enter your registered email or phone number to receive a verification code.</p>
          </div>

          <form className="form-grid" onSubmit={handleSendOtp}>
            <FormField label="Email or Phone Number">
              <input
                type="text"
                placeholder="Enter your email or phone number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </FormField>

            {error && <p className="message" style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2" }}>{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : <><KeyRound size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} /> Send Verification Code</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
