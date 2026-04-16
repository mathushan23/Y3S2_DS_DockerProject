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
    <div className="admin-dashboard container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold text-dark mb-1">Admin Control Center</h1>
          <p className="text-muted mb-0">Monitor system performance and manage healthcare entities</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm">
            <TrendingUp size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-md-3">
            <div className={`stat-card-new p-4 rounded-4 shadow-sm h-100 ${stat.color}`}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="stat-icon-wrapper rounded-3">
                  {stat.icon}
                </div>
                <span className="trend-badge d-flex align-items-center gap-1">
                  <ArrowUpRight size={14} />
                  {stat.trend}
                </span>
              </div>
              <p className="text-muted small fw-600 mb-1">{stat.label}</p>
              <h2 className="fw-bold mb-0 text-dark">{stat.value}</h2>
              <div className="stat-progress mt-3">
                <div className="progress-bar rounded-pill" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Quick Management */}
        <div className="col-lg-8">
          <div className="card-custom h-100">
            <div className="card-header-custom d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-0">System Overview</h5>
                <p className="text-muted small mb-0">Platform performance over the last 30 days</p>
              </div>
              <div className="dropdown">
                <button className="btn btn-light btn-sm rounded-3 border">Last 30 Days</button>
              </div>
            </div>

            <div className="overview-chart-container mt-4">
              <div className="mock-chart-new">
                {[40, 70, 45, 90, 65, 85, 50, 75].map((h, i) => (
                  <div key={i} className="chart-bar-wrapper">
                    <div className="chart-bar-new" style={{ height: `${h}%` }}>
                      <div className="bar-tooltip-new">{h}%</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chart-labels-new mt-3">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-4">
          <div className="card-custom h-100">
            <div className="card-header-custom mb-4">
              <h5 className="fw-bold mb-0">Recent Activity</h5>
            </div>

            <div className="activity-feed">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="activity-card-new mb-3">
                  <div className={`activity-indicator ${activity.type}`}></div>
                  <div className="activity-info ms-3">
                    <p className="activity-text text-dark fw-500 mb-0">{activity.message}</p>
                    <span className="activity-timestamp text-muted small">{activity.time}</span>
                  </div>
                  <ChevronRight size={16} className="text-muted ms-auto" />
                </div>
              ))}
            </div>

            <button className="btn btn-outline-primary w-100 mt-3 rounded-3 py-2 border-dashed">
              View All Activity
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          background-color: var(--bg-main);
          min-height: 100vh;
        }

        .stat-card-new {
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .stat-card-new:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .blue .stat-icon-wrapper { color: #3b82f6; background: #eff6ff; }
        .purple .stat-icon-wrapper { color: #8b5cf6; background: #f5f3ff; }
        .emerald .stat-icon-wrapper { color: #10b981; background: #ecfdf5; }
        .orange .stat-icon-wrapper { color: #f59e0b; background: #fffbeb; }

        .trend-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: #10b981;
          padding: 4px 8px;
          background: #ecfdf5;
          border-radius: 20px;
        }

        .stat-progress {
          height: 4px;
          background: #f1f5f9;
          width: 100%;
          border-radius: 10px;
        }

        .blue .progress-bar { background: #3b82f6; }
        .purple .progress-bar { background: #8b5cf6; }
        .emerald .progress-bar { background: #10b981; }
        .orange .progress-bar { background: #f59e0b; }

        .card-custom {
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          padding: 1.75rem;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }

        .mock-chart-new {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 240px;
          gap: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #f1f5f9;
        }

        .chart-bar-wrapper {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: flex-end;
        }

        .chart-bar-new {
          width: 100%;
          background: linear-gradient(180deg, #3b82f6 0%, #93c5fd 100%);
          border-radius: 12px 12px 4px 4px;
          position: relative;
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .chart-bar-new:hover {
          filter: brightness(1.1);
          transform: scaleX(1.1);
        }

        .bar-tooltip-new {
          position: absolute;
          top: -35px;
          left: 50%;
          transform: translateX(-50%);
          background: #1e293b;
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 600;
          opacity: 0;
          transition: 0.3s;
          pointer-events: none;
        }

        .chart-bar-new:hover .bar-tooltip-new {
          opacity: 1;
          top: -45px;
        }

        .chart-labels-new {
          display: flex;
          justify-content: space-around;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        .activity-card-new {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 16px;
          transition: 0.2s;
          border: 1px solid transparent;
        }

        .activity-card-new:hover {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .activity-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .activity-indicator.doctor { background: #8b5cf6; }
        .activity-indicator.appointment { background: #3b82f6; }
        .activity-indicator.patient { background: #10b981; }

        .fw-500 { font-weight: 500; }
        .fw-600 { font-weight: 600; }
        .border-dashed { border-style: dashed !important; border-width: 2px !important; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
