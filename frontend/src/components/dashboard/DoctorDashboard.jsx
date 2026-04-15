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
            <h1 className="fw-bold h1">
              Welcome Back, <span className="gradient-text">Dr. {user?.fullName?.split(" ")[1] || user?.fullName || "Physician"}</span>
            </h1>
            <p className="text-white-50 mb-0">You have {stats.todayAppointments} consultations scheduled for today's session.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
             <div className="action-buttons-group">
                <button className="btn-icon-glass"><Bell size={20} /></button>
                <button className="btn-premium" onClick={() => navigate('/availability')}>
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
            <div className="glass-panel stat-card-v2">
              <div className="d-flex justify-content-between mb-3">
                <div className="card-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </div>
                <div className="trend-badge positive">
                  <TrendingIcon size={12} className="me-1" />
                  {card.trend}
                </div>
              </div>
              <h3 className="fw-bold mb-0">{card.value}</h3>
              <p className="text-white-50 small mb-0">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Main Schedule Panel */}
        <div className="col-lg-8">
          <div className="glass-panel h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
               <div>
                  <h4 className="fw-bold mb-1">Today's Appointment Queue</h4>
                  <p className="text-white-50 tiny">Managing real-time patient flow</p>
               </div>
               <div className="btn-group-mini">
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
                  <Stethoscope size={48} className="text-white-10 mb-3" />
                  <p className="text-white-50">No appointments found in your queue.</p>
                </div>
              ) : (
                <table className="doctor-table">
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
                            <div className="patient-avatar-mini">
                              {apt.patientName?.charAt(0) || 'P'}
                            </div>
                            <div>
                               <div className="fw-bold">{apt.patientName}</div>
                               <div className="text-white-50 tiny">Last visit: 2 months ago</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="time-badge">
                             <Clock size={12} className="me-2" />
                             {new Date(apt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td>
                           <span className="type-tag">{apt.location === 'ONLINE' ? 'Video Call' : 'Hospital'}</span>
                        </td>
                        <td>
                           <span className={`status-pill ${getStatusClass(apt.status)}`}>
                             {apt.status}
                           </span>
                        </td>
                        <td>
                           <button className="action-btn-neon" onClick={() => navigate(`/appointments`)}>
                              <ChevronRight size={18} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <button className="btn-view-all mt-4 w-100" onClick={() => navigate('/appointments')}>
                View Full Interactive Schedule
                <ArrowRight size={16} className="ms-2" />
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-4">
           {/* Recent Activity */}
           <div className="glass-panel mb-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                 <Activity size={18} className="me-2 text-primary" />
                 Recent Clinical Activity
              </h5>
              <div className="activity-timeline">
                 {[
                   { title: "Prescription Issued", patient: "John Doe", time: "15 min ago", icon: <FileText size={14} />, color: "blue" },
                   { title: "Lab Results Ready", patient: "Maria Garcia", time: "1 hour ago", icon: <CheckCircle size={14} />, color: "green" },
                   { title: "Review Pending", patient: "Robert Fox", time: "3 hours ago", icon: <Activity size={14} />, color: "orange" },
                 ].map((act, i) => (
                   <div key={i} className="timeline-item">
                      <div className="timeline-icon" style={{ backgroundColor: `${act.color}20`, color: act.color }}>{act.icon}</div>
                      <div className="timeline-content">
                         <div className="fw-semibold small">{act.title}</div>
                         <div className="text-white-50 tiny">Patient: {act.patient} • {act.time}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Performance Analytics Card */}
           <div className="glass-panel dark-gradient-card">
              <h5 className="fw-bold mb-4">Practice Analytics</h5>
              <div className="analytics-score text-center mb-4">
                 <div className="score-circle">
                    <h2 className="mb-0 fw-bold">92%</h2>
                    <span className="tiny text-white-50">Performance</span>
                 </div>
              </div>
              <div className="stat-bars mt-4">
                 <div className="stat-bar-item mb-3">
                    <div className="d-flex justify-content-between tiny mb-1">
                       <span>Patient Satisfaction</span>
                       <span>98%</span>
                    </div>
                    <div className="progress-custom"><div className="bar" style={{ width: '98%', background: '#10b981' }}></div></div>
                 </div>
                 <div className="stat-bar-item">
                    <div className="d-flex justify-content-between tiny mb-1">
                       <span>Consultation Efficiency</span>
                       <span>84%</span>
                    </div>
                    <div className="progress-custom"><div className="bar" style={{ width: '84%', background: '#3b82f6' }}></div></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .doctor-dashboard-premium {
          color: #fff;
          padding: 1rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .badge-status {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-premium {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 14px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
        }

        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(37, 99, 235, 0.35);
        }

        .btn-icon-glass {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          margin-right: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .btn-icon-glass:hover { background: rgba(255, 255, 255, 0.1); }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 1.75rem;
        }

        .stat-card-v2 {
          transition: transform 0.3s;
          position: relative;
          overflow: hidden;
        }

        .stat-card-v2:hover { transform: translateY(-5px); }

        .card-icon {
          width: 44px;
          height: 44px;
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
          padding: 4px 8px;
          border-radius: 100px;
        }

        .trend-badge.positive { background: rgba(16, 185, 129, 0.15); color: #10b981; }

        .btn-group-mini {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 100px;
          padding: 4px;
        }

        .btn-group-mini button {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          transition: 0.2s;
        }

        .btn-group-mini button.active {
          background: #3b82f6;
          color: #fff;
        }

        .doctor-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 12px;
        }

        .doctor-table th {
          padding: 15px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
          text-transform: uppercase;
        }

        .doctor-table td {
          background: rgba(255, 255, 255, 0.02);
          padding: 18px 15px;
          vertical-align: middle;
        }

        .doctor-table tr td:first-child { border-radius: 16px 0 0 16px; }
        .doctor-table tr td:last-child { border-radius: 0 16px 16px 0; }

        .patient-avatar-mini {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fff;
        }

        .time-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .type-tag { font-size: 0.8rem; color: #a78bfa; font-weight: 600; }

        .status-pill {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-confirmed { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .status-pending { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .status-cancelled { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .status-completed { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }

        .action-btn-neon {
          width: 36px;
          height: 36px;
          background: transparent;
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .action-btn-neon:hover {
          background: #3b82f6;
          color: #fff;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }

        .btn-view-all {
          background: rgba(255, 255, 255, 0.05);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.6);
          padding: 12px;
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 600;
          transition: 0.2s;
        }

        .btn-view-all:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .activity-timeline { position: relative; }
        
        .timeline-item {
          display: flex;
          gap: 15px;
          margin-bottom: 24px;
        }

        .timeline-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 10px solid rgba(59, 130, 246, 0.1);
          border-top-color: #3b82f6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .progress-custom {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 100px;
          overflow: hidden;
        }

        .progress-custom .bar {
          height: 100%;
          border-radius: inherit;
        }

        .tiny { font-size: 0.7rem; }
        .text-white-10 { color: rgba(255, 255, 255, 0.1); }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
