import { Users, ShieldCheck, Activity, Server, Database, TrendingUp, AlertTriangle, Monitor } from "lucide-react";
import { SectionHeader } from "../common";

export default function AdminDashboard({ user }) {
  const stats = [
    { label: "Total Users", value: "1,248", trend: "+12% this month", icon: <Users size={20} /> },
    { label: "System Uptime", value: "99.98%", trend: "Last 30 days", icon: <Server size={20} /> },
    { label: "Active Sessions", value: "342", trend: "Now live", icon: <Activity size={20} /> },
    { label: "Database Load", value: "14%", trend: "Healthy", icon: <Database size={20} /> },
  ];

  const activities = [
    { user: "Admin (Self)", action: "Updated Auth Policies", time: "2 mins ago", status: "Success" },
    { user: "Dr. Emily Chen", action: "Created New Patient Record", time: "15 mins ago", status: "Success" },
    { user: "System", action: "Automated Backup Completed", time: "1 hour ago", status: "Success" },
    { user: "Unauthorized Access", action: "Failed Login Attempt", time: "3 hours ago", status: "Warning" },
  ];

  return (
    <div className="dashboard-content animate-in">
      <SectionHeader 
        title="Admin Control Center" 
        subtitle="Manage your platform's infrastructure, users, and security settings." 
      />

      <div className="page-grid">
        {stats.map((stat, i) => (
          <div key={i} className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p className="eyebrow">{stat.label}</p>
                <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)" }}>{stat.value}</h3>
              </div>
              <div className="icon-badge" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                {stat.icon}
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: stat.trend === "Warning" ? "#ef4444" : "var(--accent)" }}>{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="page-grid" style={{ marginTop: "2rem" }}>
        <div className="panel" style={{ flex: 2 }}>
          <SectionHeader title="Platform Analytics" subtitle="User engagement and appointment trends (Real-time)." />
          <div style={{ height: "240px", width: "100%", background: "var(--bg-main)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed var(--border)" }}>
            <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
              <TrendingUp size={48} style={{ marginBottom: "1rem" }} />
              <p style={{ fontWeight: 600 }}>Interactive Analytics Placeholder</p>
              <p style={{ fontSize: "0.875rem" }}>Connect Recharts / Chart.js for data visualization.</p>
            </div>
          </div>
        </div>

        <div className="panel" style={{ flex: 1.5 }}>
          <SectionHeader title="Recent Platform Activity" subtitle="Real-time audit log of system actions." />
          <div style={{ display: "grid", gap: "1rem" }}>
            {activities.map((act, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", padding: "1rem", border: "1px solid var(--border)", borderRadius: "12px" }}>
                <div style={{ 
                  width: "12px", height: "12px", borderRadius: "50%", 
                  background: act.status === "Warning" ? "#ef4444" : "#10b981", 
                  marginTop: "6px" 
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>{act.user}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{act.time}</p>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-main)" }}>{act.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel full-width" style={{ marginTop: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SectionHeader title="System Status" subtitle="Health check of your microservices and infrastructure." />
          <div className="icon-badge" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
            <ShieldCheck size={24} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginTop: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Activity size={24} color="#10b981" />
            <div>
              <p style={{ fontWeight: 700 }}>Auth Service</p>
              <p style={{ fontSize: "0.75rem", color: "#10b981" }}>Operational</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Monitor size={24} color="#10b981" />
            <div>
              <p style={{ fontWeight: 700 }}>Frontend App</p>
              <p style={{ fontSize: "0.75rem", color: "#10b981" }}>Operational</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <AlertTriangle size={24} color="#f59e0b" />
            <div>
              <p style={{ fontWeight: 700 }}>Telemedicine Node</p>
              <p style={{ fontSize: "0.75rem", color: "#f59e0b" }}>High Latency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
