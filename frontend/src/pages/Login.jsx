import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { request, FormField } from "../components/common";
import { LogIn, Heart, ShieldCheck, Activity } from "lucide-react";
import authBg from "../assets/auth_bg.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
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
            <h1>Welcome Back</h1>
            <p className="lead">Please enter your details to sign in</p>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <FormField label="Email Address">
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </FormField>
            <FormField label="Password">
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </FormField>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-0.5rem", marginBottom: "1rem" }}>
              <Link to="/forgot-password" style={{ fontSize: "0.875rem", color: "#0ea5e9", textDecoration: "none", fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>

            {error && <p className="message" style={{ color: "#ef4444", background: "#fef2f2", border: "1px solid #fee2e2" }}>{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : <><LogIn size={20} style={{ marginRight: "0.5rem", verticalAlign: "middle" }} /> Sign In</>}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Create one for free</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

