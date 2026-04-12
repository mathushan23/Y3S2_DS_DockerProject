import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { HeartPulse, Bell, User } from "lucide-react";

export default function Layout() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <header className="top-header">
          <div className="logo-brand">
            <HeartPulse size={32} color="var(--accent)" fill="var(--accent-light)" />
            <span>SmartHealth</span>
          </div>
          
          <div className="user-profile-summary">
            <button className="btn-icon">
              <Bell size={20} />
            </button>
            <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>{user?.fullName || "Guest User"}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user?.role || "Member"}</p>
            </div>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
              <User size={24} />
            </div>
          </div>
        </header>

        <section className="content animate-fade-in" style={{ padding: "2rem" }}>
          <Outlet />
        </section>
      </div>
    </div>
  );
}

