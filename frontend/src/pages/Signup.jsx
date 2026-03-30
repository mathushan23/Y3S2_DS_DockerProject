import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request, FormField } from "../components/common";
import { UserPlus, Heart, ShieldCheck, Activity } from "lucide-react";
import authBg from "../assets/auth_bg.png";

export default function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "PATIENT", phoneNumber: "", specialty: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.phoneNumber) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }

    if (form.role === "DOCTOR" && !form.specialty) {
      setError("Specialty is required for doctors");
      setLoading(false);
      return;
    }

    try {
      const payload = { ...form };
      await request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      navigate("/login", { state: { message: "Account created successfully! Please sign in." } });
    } catch (err) {
      const cleanError = err.message.includes("An unexpected error occurred:") 
        ? err.message.split("An unexpected error occurred:")[1].trim()
        : err.message;
      setError(cleanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <Heart size={64} color="#0ea5e9" fill="#0ea5e9" style={{ marginBottom: "2rem" }} />
          <h2>Join the Future of Healthcare.</h2>
          <p>Create an account to start managing your health journey with our smart integrated platform.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <ShieldCheck size={24} color="#0ea5e9" />
              <span>Personalized Health Insights</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Activity size={24} color="#0ea5e9" />
              <span>Direct Doctor Communication</span>
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
        <div className="auth-container" style={{ maxWidth: "500px" }}>
          <div className="auth-header">
            <h1>Create Account</h1>
            <p className="lead">Join our professional healthcare community</p>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <FormField label="Full Name">
                <input
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Email Address">
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <FormField label="Password">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Phone Number">
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  required
                />
              </FormField>
            </div>

            <FormField label="Your Role">
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </FormField>

            {form.role === "DOCTOR" && (
              <FormField label="Specialization">
                <input
                  placeholder="e.g. Cardiology, Neurology"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  required
                />
              </FormField>
            )}

            {error && <p className="message" style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2" }}>{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : <><UserPlus size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} /> Create Account</>}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

