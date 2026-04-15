import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { Lock, ShieldCheck, Activity, CheckCircle2, Heart } from "lucide-react";
import authBg from "../assets/auth_bg.png";

export default function ResetPassword() {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken;

  useEffect(() => {
    if (!resetToken) {
      navigate("/forgot-password");
    }
  }, [resetToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { 
        resetToken,
        newPassword: form.newPassword 
      });
      setSuccess("Your password has been successfully reset. Redirecting to Login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
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
          <div className="auth-header">
            <h1>Reset Password</h1>
            <p className="lead">Please enter your new password to secure your account.</p>
          </div>

          {!success ? (
            <form className="form-grid" onSubmit={handleSubmit}>
              <FormField label="New Password">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Confirm Password">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
              </FormField>

              {error && <p className="message" style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2" }}>{error}</p>}

              <button type="submit" disabled={loading}>
                {loading ? "Resetting..." : <><Lock size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} /> Reset Password</>}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", background: "#ecfdf5", border: "1px solid #d1fae5", borderRadius: "1rem" }}>
              <CheckCircle2 color="#10b981" size={48} style={{ margin: "0 auto 1.5rem" }} />
              <h3 style={{ color: "#065f46", marginBottom: "0.5rem" }}>Success!</h3>
              <p style={{ color: "#065f46" }}>{success}</p>
              <p style={{ color: "#64748b", marginTop: "1rem", fontSize: "0.875rem" }}>Redirecting you automatically...</p>
              <Link to="/login" style={{ display: "inline-block", marginTop: "1.5rem", color: "#0ea5e9", fontWeight: 600 }}>
                Click here if not redirected
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
