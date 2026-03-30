import { HeartPulse, Calendar, Pill, History, Video, Activity, Scale, Bell } from "lucide-react";
import { SectionHeader } from "../common";

export default function PatientDashboard({ user }) {
  const stats = [
    { label: "Blood Glucose", value: "98", unit: "mg/dL", icon: <Activity size={20} />, status: "Normal" },
    { label: "Weight", value: "72", unit: "kg", icon: <Scale size={20} />, status: "-2kg this month" },
    { label: "Heart Rate", value: "74", unit: "bpm", icon: <HeartPulse size={20} />, status: "Resting" },
  ];

  const medications = [
    { name: "Metformin", dosage: "500mg", schedule: "Twice Daily", remaining: "12 days" },
    { name: "Atorvastatin", dosage: "20mg", schedule: "Bedtime", remaining: "24 days" },
  ];

  return (
    <div className="dashboard-content animate-in">
      <SectionHeader 
        title={`Hello, ${user?.fullName?.split(" ")[0] || "Back"}!`} 
        subtitle="Check your health overview and upcoming medical activities." 
      />

      <div className="page-grid">
        <div className="panel" style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div>
              <p className="eyebrow" style={{ color: "rgba(255, 255, 255, 0.8)" }}>Next Appointment</p>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Tuesday, Oct 12</h2>
              <p style={{ marginTop: "0.25rem", color: "rgba(255, 255, 255, 0.9)" }}>with Dr. Sarah Miller (Cardiology)</p>
            </div>
            <div className="icon-badge" style={{ background: "rgba(255, 255, 255, 0.2)", color: "white" }}>
              <Calendar size={24} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="secondary" style={{ flex: 1, color: "var(--primary)" }}>Reschedule</button>
            <button className="primary" style={{ flex: 1, backgroundColor: "white", color: "var(--accent)" }}>Join Call</button>
          </div>
        </div>

        <div className="panel">
          <SectionHeader title="Your Health Metrics" subtitle="Latest recorded vitals." />
          <div style={{ display: "grid", gap: "1rem" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "var(--bg-main)", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div className="icon-badge">{stat.icon}</div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>{stat.label}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{stat.status}</p>
                  </div>
                </div>
                <p style={{ fontSize: "1.25rem", fontWeight: 800 }}>{stat.value} <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)" }}>{stat.unit}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-grid" style={{ marginTop: "2rem" }}>
        <div className="panel" style={{ flex: 2 }}>
          <SectionHeader title="Current Prescriptions" subtitle="Manage your daily medicine schedule." />
          <div className="prescriptions-list" style={{ display: "grid", gap: "1rem" }}>
            {medications.map((med, i) => (
              <div key={i} className="list-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem", border: "1px solid var(--border)", borderRadius: "16px" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div className="icon-badge" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                    <Pill size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>{med.name} <span style={{ fontWeight: 500, color: "var(--text-muted)", fontSize: "0.875rem" }}>({med.dosage})</span></h4>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{med.schedule}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--accent)" }}>{med.remaining} left</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Order Refill</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ flex: 1 }}>
          <SectionHeader title="Health Notifications" subtitle="Updates on your medical care." />
          <div className="notifications-feed" style={{ display: "grid", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", padding: "1rem", backgroundColor: "var(--bg-main)", borderRadius: "12px" }}>
              <Bell size={18} color="var(--accent)" />
              <p style={{ fontSize: "0.875rem" }}>Lab results for <strong>Blood Work</strong> are now available for review.</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", padding: "1rem", backgroundColor: "var(--bg-main)", borderRadius: "12px" }}>
              <History size={18} color="var(--text-muted)" />
              <p style={{ fontSize: "0.875rem" }}>Your appointment with <strong>Dr. Sarah Miller</strong> was successfully scheduled.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
