import React, { useState, useEffect } from "react";
import {
  HeartPulse,
  Calendar,
  Clock,
  Users,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  Award,
  Star,
  Bell,
  ChevronRight,
  Loader2,
  Stethoscope,
  Plus,
  ArrowRight,
  DollarSign,
  TrendingUp as TrendingIcon,
  Search,
  Filter,
  UserCheck,
  UserMinus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 1247,
    todayAppointments: 8,
    pendingRequests: 3,
    satisfactionRate: 98,
    revenue: 12500
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch appointments for this doctor
        if (user?.id) {
          const data = await api.get(`/api/appointments?doctorId=${user.id}`);
          setAppointments(data);

          // Filter today's appointments
          const today = new Date().toISOString().split('T')[0];
          const todayAppts = data.filter(a => a.appointmentDateTime?.startsWith(today));

          setStats(prev => ({
            ...prev,
            todayAppointments: todayAppts.length,
            pendingRequests: data.filter(a => a.status === 'PENDING').length
          }));
        }
      } catch (err) {
        console.error("Error fetching doctor dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  const summaryCards = [
    { label: "Total Patients", value: stats.totalPatients, icon: <Users size={24} />, color: "#3b82f6", trend: "+12%" },
    { label: "Today's Visits", value: stats.todayAppointments, icon: <Calendar size={24} />, color: "#10b981", trend: "+5%" },
    { label: "Satisfaction", value: `${stats.satisfactionRate}%`, icon: <Star size={24} />, color: "#f59e0b", trend: "Top 5%" },
    { label: "Monthly Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: <DollarSign size={24} />, color: "#8b5cf6", trend: "+18%" },
  ];

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'status-confirmed';
      case 'PENDING': return 'status-pending';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      default: return '';
    }
  };

  return (
    <div className="doctor-dashboard-premium animate-fade-in">
      {/* Dynamic Header */}
      <header className="dashboard-header mb-5">
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="badge-status mb-2">
              <Activity size={14} className="me-2 text-primary" />
              System Status: Functional
            </div>
            <h1 className="fw-bold h1 text-slate-900">
              Welcome Back, <span className="text-primary">Dr. {user?.fullName?.split(" ")[1] || user?.fullName || "Physician"}</span>
            </h1>
            <p className="text-slate-500 mb-0">You have {stats.todayAppointments} consultations scheduled for today's session.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <div className="action-buttons-group">
              {/* <button className="btn-icon-light"><Bell size={20} /></button> */}
              <button className="btn-primary-premium" onClick={() => navigate('/availability')}>
                <Plus size={18} className="me-2" />
                Manage Schedule
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="row g-4 mb-5">
        {summaryCards.map((card, i) => (
          <div key={i} className="col-sm-6 col-xl-3">
            <div className="stat-card-premium">
              <div className="d-flex justify-content-between mb-3">
                <div className="card-icon" style={{ backgroundColor: `${card.color}10`, color: card.color }}>
                  {card.icon}
                </div>
                <div className="trend-badge positive">
                  <TrendingIcon size={12} className="me-1" />
                  {card.trend}
                </div>
              </div>
              <h3 className="fw-bold mb-0 text-slate-900">{card.value}</h3>
              <p className="text-slate-500 small mb-0">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Main Schedule Panel */}
        <div className="col-lg-8">
          <div className="content-panel-premium h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-slate-900">Today's Appointment Queue</h4>
                <p className="text-slate-500 tiny">Managing real-time patient flow</p>
              </div>
              <div className="btn-group-premium">
                <button className="active">All</button>
                <button>Telemedicine</button>
                <button>In-Clinic</button>
              </div>
            </div>

            <div className="table-responsive-custom">
              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-5">
                  <Stethoscope size={48} className="text-slate-200 mb-3" />
                  <p className="text-slate-400">No appointments found in your queue.</p>
                </div>
              ) : (
                <table className="doctor-table-premium">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Time</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 6).map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="patient-avatar-premium">
                              {apt.patientName?.charAt(0) || 'P'}
                            </div>
                            <div>
                              <div className="fw-bold text-slate-800">{apt.patientName}</div>
                              <div className="text-slate-400 tiny">Last visit: 2 months ago</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="time-badge-premium">
                            <Clock size={12} className="me-2 text-primary" />
                            {new Date(apt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td>
                          <span className="type-tag-premium">{apt.location === 'ONLINE' ? 'Video Call' : 'Hospital'}</span>
                        </td>
                        <td>
                          <span className={`status-pill-premium ${getStatusClass(apt.status)}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action-premium" onClick={() => navigate(`/appointments`)}>
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <button className="btn-view-all-premium mt-4 w-100" onClick={() => navigate('/appointments')}>
              View Full Interactive Schedule
              <ArrowRight size={16} className="ms-2" />
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-4">
          {/* Recent Activity */}
          <div className="content-panel-premium mb-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center text-slate-900">
              <Activity size={18} className="me-2 text-primary" />
              Recent Clinical Activity
            </h5>
            <div className="activity-timeline-premium">
              {[
                { title: "Prescription Issued", patient: "John Doe", time: "15 min ago", icon: <FileText size={14} />, color: "#3b82f6" },
                { title: "Lab Results Ready", patient: "Maria Garcia", time: "1 hour ago", icon: <CheckCircle size={14} />, color: "#10b981" },
                { title: "Review Pending", patient: "Robert Fox", time: "3 hours ago", icon: <Activity size={14} />, color: "#f59e0b" },
              ].map((act, i) => (
                <div key={i} className="timeline-item-premium">
                  <div className="timeline-icon-premium" style={{ backgroundColor: `${act.color}15`, color: act.color }}>{act.icon}</div>
                  <div className="timeline-content">
                    <div className="fw-semibold small text-slate-800">{act.title}</div>
                    <div className="text-slate-500 tiny">Patient: {act.patient} • {act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Analytics Card */}
          <div className="content-panel-premium accent-gradient-card">
            <h5 className="fw-bold mb-4 text-slate-900">Practice Analytics</h5>
            <div className="analytics-score text-center mb-4">
              <div className="score-circle-premium">
                <h2 className="mb-0 fw-bold text-slate-900">92%</h2>
                <span className="tiny text-slate-500">Performance</span>
              </div>
            </div>
            <div className="stat-bars mt-4">
              <div className="stat-bar-item mb-3">
                <div className="d-flex justify-content-between tiny mb-1">
                  <span className="text-slate-600">Patient Satisfaction</span>
                  <span className="fw-bold text-slate-900">98%</span>
                </div>
                <div className="progress-premium"><div className="bar" style={{ width: '98%', background: '#10b981' }}></div></div>
              </div>
              <div className="stat-bar-item">
                <div className="d-flex justify-content-between tiny mb-1">
                  <span className="text-slate-600">Consultation Efficiency</span>
                  <span className="fw-bold text-slate-900">84%</span>
                </div>
                <div className="progress-premium"><div className="bar" style={{ width: '84%', background: '#3b82f6' }}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .doctor-dashboard-premium {
          color: var(--text-main);
          padding: 1rem;
        }

        .text-slate-900 { color: #0f172a; }
        .text-slate-800 { color: #1e293b; }
        .text-slate-600 { color: #475569; }
        .text-slate-500 { color: #64748b; }
        .text-slate-400 { color: #94a3b8; }
        .text-slate-200 { color: #e2e8f0; }

        .badge-status {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          background: #f8fafc;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid var(--border);
          color: var(--text-muted);
        }

        .btn-primary-premium {
          background: var(--primary);
          color: #fff;
          border: none;
          padding: 0.8rem 1.6rem;
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .btn-primary-premium:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        .btn-icon-light {
          background: #fff;
          border: 1px solid var(--border);
          color: var(--text-muted);
          width: 48px;
          height: 48px;
          border-radius: 12px;
          margin-right: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
          box-shadow: var(--shadow-sm);
        }

        .btn-icon-light:hover { 
          border-color: var(--primary);
          color: var(--primary);
          background: var(--accent-light);
        }

        .stat-card-premium {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }

        .stat-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }

        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trend-badge {
          display: flex;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 100px;
        }

        .trend-badge.positive { background: #dcfce7; color: #166534; }

        .content-panel-premium {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: var(--shadow-sm);
        }

        .btn-group-premium {
          display: flex;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 4px;
        }

        .btn-group-premium button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
          transition: 0.2s;
        }

        .btn-group-premium button.active {
          background: #fff;
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }

        .doctor-table-premium {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 16px;
          margin-top: -16px;
        }

        .doctor-table-premium th {
          padding: 1rem 1.5rem;
          font-size: 0.75rem;
          color: var(--text-light);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .doctor-table-premium td {
          background: #fff;
          padding: 1.25rem 1.5rem;
          vertical-align: middle;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }

        .doctor-table-premium tr td:first-child { border-left: 1px solid var(--border-light); border-radius: 16px 0 0 16px; }
        .doctor-table-premium tr td:last-child { border-right: 1px solid var(--border-light); border-radius: 0 16px 16px 0; }

        .patient-avatar-premium {
          width: 44px;
          height: 44px;
          background: var(--accent-light);
          color: var(--primary);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .time-badge-premium {
          display: inline-flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid var(--border);
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .type-tag-premium { 
          font-size: 0.8rem; 
          color: var(--primary); 
          font-weight: 700;
          background: var(--accent-light);
          padding: 4px 12px;
          border-radius: 8px;
        }

        .status-pill-premium {
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-confirmed { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef9c3; color: #854d0e; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        .status-completed { background: #e0f2fe; color: #075985; }

        .btn-action-premium {
          width: 40px;
          height: 40px;
          background: #fff;
          border: 1px solid var(--border);
          color: var(--text-muted);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s;
        }

        .btn-action-premium:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--accent-light);
        }

        .btn-view-all-premium {
          background: #f8fafc;
          border: 1px solid var(--border);
          color: var(--text-muted);
          padding: 1rem;
          border-radius: 16px;
          font-size: 0.9rem;
          font-weight: 700;
          transition: 0.2s;
        }

        .btn-view-all-premium:hover {
          background: #f1f5f9;
          color: var(--primary);
          border-color: var(--primary);
        }

        .activity-timeline-premium { position: relative; }
        
        .timeline-item-premium {
          display: flex;
          gap: 15px;
          margin-bottom: 24px;
        }

        .timeline-icon-premium {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .score-circle-premium {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 8px solid #f1f5f9;
          border-top-color: var(--primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: inset var(--shadow-sm);
        }

        .progress-premium {
          width: 100%;
          height: 8px;
          background: #f1f5f9;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-premium .bar {
          height: 100%;
          border-radius: inherit;
        }

        .tiny { font-size: 0.75rem; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
