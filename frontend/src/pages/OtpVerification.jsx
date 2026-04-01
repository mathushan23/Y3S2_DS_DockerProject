import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { ArrowLeft, CheckCircle2, RefreshCw, Heart, ShieldCheck, Activity } from "lucide-react";
import authBg from "../assets/auth_bg.png";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier;

  useEffect(() => {
    if (!identifier) {
      navigate("/forgot-password");
    }
  }, [identifier, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split("").forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      // Auto-submit if full?
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/verify-otp", { identifier, otp: otpString });
      navigate("/reset-password", { state: { identifier } });
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError("");
    setSuccess("");
    try {
      await api.post("/api/auth/forgot-password", { identifier });
      setSuccess("New code sent successfully.");
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } catch (err) {
      setError(err.message || "Failed to resend verification code.");
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <Heart size={64} color="#0ea5e9" fill="#0ea5e9" style={{ marginBottom: "2rem" }} />
          <h2>Protecting Your Wellness.</h2>
          <p>We've sent a 6-digit verification code to your registered device. Please enter it to proceed with password reset.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <ShieldCheck size={24} color="#0ea5e9" />
              <span>Multi-factor Protection</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Activity size={24} color="#0ea5e9" />
              <span>Secure Session Management</span>
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
          <Link to="/forgot-password" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", textDecoration: "none", marginBottom: "2rem", fontSize: "0.875rem" }}>
            <ArrowLeft size={16} /> Back
          </Link>
          
          <div className="auth-header">
            <h1>Verify OTP</h1>
            <p className="lead">Verification code sent to <strong>{identifier}</strong></p>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem" }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  style={{
                    width: "3rem",
                    height: "3.5rem",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    borderRadius: "0.75rem",
                    border: "2px solid #e2e8f0",
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0ea5e9")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && <p className="message" style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2" }}>{error}</p>}
            {success && <p className="message" style={{ color: "#10b981", background: "#ecfdf5", border: "1px solid #d1fae5" }}>{success}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : <><CheckCircle2 size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} /> Verify Code</>}
            </button>

            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0}
                style={{
                  background: "none",
                  border: "none",
                  color: countdown > 0 ? "#94a3b8" : "#0ea5e9",
                  cursor: countdown > 0 ? "default" : "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  margin: "0 auto"
                }}
              >
                <RefreshCw size={14} className={countdown === 0 ? "" : "animate-spin"} />
                {countdown > 0 ? `Resend Code in ${countdown}s` : "Resend Verification Code"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
