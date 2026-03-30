import { Activity, Users, Clock, ClipboardList, PlusCircle, Search, Video, User, MoreVertical, Calendar } from "lucide-react";
import { SectionHeader } from "../common";

export default function DoctorDashboard({ user }) {
  const stats = [
    { label: "Patients Today", value: "08", icon: <Users size={22} />, trend: "2 pending", color: "#0ea5e9" },
    { label: "Avg. Session", value: "24m", icon: <Clock size={22} />, trend: "Optimal", color: "#10b981" },
    { label: "New Records", value: "12", icon: <ClipboardList size={22} />, trend: "+4 today", color: "#f59e0b" },
  ];

  const schedule = [
    { time: "09:00 AM", patient: "Sarah Miller", type: "Follow-up", status: "In Progress" },
    { time: "10:30 AM", patient: "John Davis", type: "Initial Consultation", status: "Waiting" },
    { time: "11:15 AM", patient: "Robert Wilson", type: "Report Review", status: "Scheduled" },
    { time: "01:00 PM", patient: "Emily Chen", type: "Telemedicine", status: "Scheduled" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Top Header Greeting */}
      <div className="panel-header" style={{ marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--primary)", marginBottom: "0.25rem" }}>
            Greetings, Dr. {user?.fullName?.split(" ").pop() || "Professional"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Here is your clinical overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
          </p>
        </div>
        <div className="btn-action-group">
          <button className="secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={18} />
            View Full Calendar
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="dashboard-grid">
        {stats.map((stat, i) => (
          <div key={i} className="panel" style={{ borderLeft: `4px solid ${stat.color}`, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>{stat.label}</p>
              <h3 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>{stat.value}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.5rem", fontWeight: 500 }}>
                {stat.trend}
              </p>
            </div>
            <div className="icon-badge" style={{ width: "52px", height: "52px", borderRadius: "14px", background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Appointments Table Section */}
      <div className="panel" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Today's Appointments</h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Manage your upcoming patient sessions and records.</p>
          </div>
          <button className="btn-icon">
            <MoreVertical size={20} />
          </button>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th className="text-left">Time</th>
              <th className="text-left">Patient</th>
              <th className="text-left">Type</th>
              <th className="text-left">Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 700, color: "var(--primary)" }}>{item.time}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={16} color="var(--text-muted)" />
                    </div>
                    <span style={{ fontWeight: 600 }}>{item.patient}</span>
                  </div>
                </td>
                <td><span className="badge">{item.type}</span></td>
                <td>
                  <span className={`status-pill ${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </span>
                </td>
                <td className="text-right">
                  <div className="btn-action-group" style={{ justifyContent: "flex-end" }}>
                    <button className="btn-icon" title="View Records">
                      <Search size={16} />
                    </button>
                    <button className="btn-icon" style={{ background: "var(--accent-light)", color: "var(--accent)" }} title="Start Session">
                      <Video size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions Bar */}
      <div style={{ marginTop: "2rem" }}>
        <h3 className="eyebrow" style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>QUICK CLINICAL ACTIONS</h3>
        <div className="quick-actions-grid">
          <div className="action-card">
            <div className="icon-badge" style={{ background: "#e0f2fe", color: "#0ea5e9" }}>
              <PlusCircle size={24} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem" }}>New Prescription</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Generate e-prescription for patient</p>
            </div>
          </div>
          
          <div className="action-card">
            <div className="icon-badge" style={{ background: "#dcfce7", color: "#10b981" }}>
              <Video size={24} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem" }}>Telemedicine</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Start a secure video consultation</p>
            </div>
          </div>
          
          <div className="action-card">
            <div className="icon-badge" style={{ background: "#fef9c3", color: "#854d0e" }}>
              <ClipboardList size={24} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1rem" }}>View Lab Results</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Review pending laboratory reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

