import React, { useEffect, useState } from "react";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  Activity,
  TrendingUp,
  UserPlus,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Loader2
} from "lucide-react";
import api from "../../api";

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get("/api/admin/dashboard/stats");
        setStatsData(data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: "Total Patients", value: statsData?.totalPatients?.toLocaleString() || "0", icon: <Users size={24} />, color: "blue", trend: "+12%" },
    { label: "Active Doctors", value: statsData?.activeDoctors?.toLocaleString() || "0", icon: <Stethoscope size={24} />, color: "purple", trend: "+5%" },
    { label: "Total Appointments", value: statsData?.totalAppointments?.toLocaleString() || "0", icon: <CalendarCheck size={24} />, color: "emerald", trend: "+18%" },
    { label: "Platform Usage", value: statsData?.platformUsage || "0%", icon: <Activity size={24} />, color: "orange", trend: "+7%" }
  ];

  const recentActivities = [
    { type: "doctor", message: "Dr. Sarah Smith joined the platform", time: "2 hours ago" },
    { type: "appointment", message: "New appointment booked for John Doe", time: "3 hours ago" },
    { type: "patient", message: "Mark Wilson updated medical profile", time: "5 hours ago" },
    { type: "doctor", message: "Dr. James Bond completed 100th appointment", time: "1 day ago" }
  ];

  return (
    <div className="admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Control Center</h2>
          <p className="text-white-50">Monitor system performance and manage healthcare entities</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-glass">
            <TrendingUp size={18} className="me-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-md-3">
            <div className={`stat-card ${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <p className="stat-label mb-0">{stat.label}</p>
                <div className="d-flex align-items-baseline gap-2">
                  <h3 className="stat-value mb-0">{stat.value}</h3>
                  <span className="stat-trend">{stat.trend}</span>
                </div>
              </div>
              <div className="stat-decoration"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Quick Management */}
        <div className="col-lg-8">
          <div className="glass-panel h-100">
            <div className="panel-header mb-4">
              <h5 className="mb-0">System Overview</h5>
              <p className="text-white-50 small mb-0">Platform performance over the last 30 days</p>
            </div>

            <div className="overview-chart-placeholder">
              {/* Complex decoration to look like a chart */}
              <div className="mock-chart">
                {[40, 70, 45, 90, 65, 85, 50, 75].map((h, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${h}%` }}>
                    <div className="bar-tooltip">{h}%</div>
                  </div>
                ))}
              </div>
              <div className="chart-labels">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-4">
          <div className="glass-panel h-100">
            <div className="panel-header mb-4">
              <h5 className="mb-0">Recent Activity</h5>
            </div>

            <div className="activity-list">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <div className={`activity-bullet ${activity.type}`}></div>
                  <div className="activity-content">
                    <p className="activity-msg mb-0">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <ChevronRight size={14} className="activity-arrow" />
                </div>
              ))}
            </div>

            <button className="btn-outline-glass w-100 mt-4">
              View All Activity
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          animation: fadeIn 0.8s ease-out;
        }

        .btn-glass {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
          padding: 0.6rem 1.25rem;
          border-radius: 12px;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .btn-glass:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .stat-card {
          padding: 1.5rem;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          background: rgba(255, 255, 255, 0.05);
        }

        .blue .stat-icon { color: #60a5fa; background: rgba(59, 130, 246, 0.15); }
        .purple .stat-icon { color: #a78bfa; background: rgba(139, 92, 246, 0.15); }
        .emerald .stat-icon { color: #34d399; background: rgba(16, 185, 129, 0.15); }
        .orange .stat-icon { color: #fb923c; background: rgba(249, 115, 22, 0.15); }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #fff;
        }

        .stat-trend {
          font-size: 0.8rem;
          font-weight: 600;
          color: #34d399;
          padding: 2px 8px;
          border-radius: 20px;
          background: rgba(52, 211, 153, 0.1);
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 1.75rem;
          backdrop-filter: blur(12px);
        }

        .overview-chart-placeholder {
          height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-top: 2rem;
        }

        .mock-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 200px;
          gap: 10px;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .chart-bar {
          width: 100%;
          background: linear-gradient(180deg, #3b82f6 0%, rgba(59, 130, 246, 0.2) 100%);
          border-radius: 8px 8px 0 0;
          position: relative;
          transition: all 0.3s ease;
        }

        .chart-bar:hover {
          filter: brightness(1.2);
        }

        .bar-tooltip {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          color: #000;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .chart-bar:hover .bar-tooltip {
          opacity: 1;
        }

        .chart-labels {
          display: flex;
          justify-content: space-around;
          margin-top: 1rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .activity-item:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(5px);
        }

        .activity-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .activity-bullet.doctor { background: #a78bfa; box-shadow: 0 0 8px #a78bfa; }
        .activity-bullet.appointment { background: #60a5fa; box-shadow: 0 0 8px #60a5fa; }
        .activity-bullet.patient { background: #34d399; box-shadow: 0 0 8px #34d399; }

        .activity-msg {
          font-size: 0.9rem;
          color: #fff;
        }

        .activity-time {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }

        .activity-arrow {
          margin-left: auto;
          color: rgba(255,255,255,0.2);
        }

        .btn-outline-glass {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          padding: 0.6rem;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .btn-outline-glass:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.03);
          color: #fff;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
