import React, { useEffect, useState } from "react";
import { 
  HeartPulse, 
  Calendar, 
  Pill, 
  History, 
  Video, 
  Activity, 
  Scale, 
  Bell, 
  Sparkles, 
  ArrowRight,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Loader2,
  Stethoscope,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function PatientDashboard({ user }) {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const doctorsData = await api.get("/api/doctors");
        setDoctors(doctorsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Blood Glucose", value: "98", unit: "mg/dL", icon: <Activity size={20} />, status: "Normal", color: "#3b82f6" },
    { label: "Heart Rate", value: "74", unit: "bpm", icon: <HeartPulse size={20} />, status: "Resting", color: "#ef4444" },
    { label: "Weight", value: "72", unit: "kg", icon: <Scale size={20} />, status: "Normal", color: "#10b981" },
  ];

  // Helper to get a random doctor image if none exists
  const getDoctorImg = (gender, id) => {
    const g = gender?.toLowerCase() === "female" ? "women" : "men";
    return `https://randomuser.me/api/portraits/${g}/${(id % 50) + 1}.jpg`;
  };

  return (
    <div className="patient-dashboard-v2 animate-fade-in container-fluid p-4">
      {/* Welcome Header */}
      <header className="welcome-section mb-5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold text-dark mb-1">
              Welcome back, <span className="text-primary">{user?.fullName?.split(" ")[0] || "Patient"}</span>
            </h1>
            <p className="text-secondary mb-0">Your personalized health sanctuary is updated and ready.</p>
          </div>
          <div className="date-chip-new shadow-sm">
            <Calendar size={18} className="me-2 text-primary" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <div className="row g-4 mb-5">
        {/* Main Stats */}
        <div className="col-lg-8">
          <div className="hero-card shadow-sm h-100 p-4 rounded-4 border-0">
            <div className="row h-100 align-items-center">
              <div className="col-md-7">
                <div className="badge-ai-new mb-3">
                  <Sparkles size={14} className="me-2" />
                  AI-Powered Health Analysis
                </div>
                <h2 className="fw-bold text-dark mb-3">Connect with our top medical minds.</h2>
                <p className="text-secondary mb-4">
                  Schedule virtual or in-person visits with verified professionals. Your health metrics are within normal range.
                </p>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary px-4 py-2 rounded-pill shadow-sm" onClick={() => navigate("/appointments")}>
                    Book Appointment
                  </button>
                  <button className="btn btn-outline-primary px-4 py-2 rounded-pill shadow-none" onClick={() => navigate("/symptom-checker")}>
                    Check Symptoms
                  </button>
                </div>
              </div>
              <div className="col-md-5 d-none d-md-block">
                <div className="hero-stats-grid-new">
                  {stats.map((stat, i) => (
                    <div key={i} className="mini-stat-card-new shadow-sm border-0">
                      <div className="icon-wrapper" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                      <div className="stat-info">
                        <span className="val text-dark">{stat.value}</span>
                        <span className="unit">{stat.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications / Next Appt */}
        <div className="col-lg-4">
          <div className="card-custom h-100 shadow-sm border-0 rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 fw-bold text-dark">Upcoming Consultation</h5>
              <div className="pulse-dot-new"></div>
            </div>
            <div className="appt-card-v2 p-3 rounded-4 bg-light border-0">
              <div className="d-flex gap-3 mb-3">
                <div className="doctor-avatar-circle shadow-sm">SM</div>
                <div>
                  <h6 className="mb-0 text-dark fw-bold">Dr. Sarah Miller</h6>
                  <p className="text-muted small mb-0">Cardiology Specialist</p>
                </div>
              </div>
              <div className="schedule-box p-3 rounded-3 bg-white mb-3 shadow-none border">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Calendar size={14} className="text-primary" />
                  <span className="small fw-bold text-dark text-opacity-75">October 24, 2024</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span className="small fw-bold text-dark text-opacity-75">10:30 AM (Online Visit)</span>
                </div>
              </div>
              <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill py-2">
                <Video size={16} />
                <span>Join Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Doctors Section */}
      <section className="recommended-doctors mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Top Medical Professionals</h3>
            <p className="text-secondary small">Based on your health profile and recent activity</p>
          </div>
          <button className="btn btn-link text-decoration-none fw-bold p-0 d-flex align-items-center" onClick={() => navigate("/doctors")}>
            Browse All <ChevronRight size={18} />
          </button>
        </div>

        <div className="doctor-scroll-container">
          {loading ? (
            <div className="d-flex justify-content-center py-5 w-100">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : doctors.length === 0 ? (
            <div className="empty-state p-5 text-center w-100 bg-light rounded-4">
              <Stethoscope size={48} className="text-muted opacity-25 mb-3" />
              <p className="text-muted">No medical professionals available currently.</p>
            </div>
          ) : (
            <div className="row g-4">
              {doctors.slice(0, 4).map((doctor) => (
                <div key={doctor.id} className="col-md-6 col-lg-3">
                  <div className="doctor-card-new shadow-sm border-0 rounded-4 h-100">
                    <div className="position-relative overflow-hidden rounded-top-4">
                      <img 
                        src={doctor.profilePhotoUrl || getDoctorImg(doctor.gender, doctor.id)} 
                        alt={doctor.fullName} 
                        className="doctor-image-v2"
                      />
                      <div className="rating-badge-new">
                        <Star size={12} className="fill-warning text-warning me-1" />
                        {doctor.averageRating || "4.8"}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                         <h6 className="text-dark fw-bold mb-0">{doctor.fullName}</h6>
                         <div className="verified-badge">
                            <Activity size={12} />
                         </div>
                      </div>
                      <p className="text-primary small fw-bold mb-3">{doctor.specialty}</p>
                      
                      <div className="meta-info-grid mb-3">
                         <div className="meta-cell">
                            <Users size={12} className="me-1" />
                            <span>{doctor.totalPatients || 0}+ patients</span>
                         </div>
                         <div className="meta-cell">
                            <MapPin size={12} className="me-1" />
                            <span>{doctor.clinicName || "City Clinic"}</span>
                         </div>
                      </div>

                      <button 
                        className="btn btn-light w-100 rounded-3 fw-bold btn-sm py-2 shadow-none border"
                        onClick={() => navigate(`/appointments?doctorId=${doctor.id}`)}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Medical History & Activity */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card-custom shadow-sm border-0 rounded-4 p-4 h-100">
            <h5 className="fw-bold text-dark mb-4">Active Prescriptions</h5>
            <div className="prescription-feed">
               {[
                 { name: "Metformin", dosage: "500mg", schedule: "Twice Daily", remaining: 12, color: "#3b82f6" },
                 { name: "Atorvastatin", dosage: "20mg", schedule: "Bedtime", remaining: 24, color: "#10b981" }
               ].map((med, i) => (
                 <div key={i} className="med-card-new shadow-none border bg-light mb-3">
                   <div className="med-icon-v2" style={{ backgroundColor: `${med.color}15`, color: med.color }}>
                     <Pill size={20} />
                   </div>
                   <div className="flex-grow-1">
                     <h6 className="mb-0 text-dark fw-bold">{med.name}</h6>
                     <span className="text-muted small">{med.dosage} • {med.schedule}</span>
                   </div>
                   <div className="med-progress-info">
                     <div className="progress-custom">
                       <div className="progress-bar-inner" style={{ width: `${(med.remaining/30)*100}%`, backgroundColor: med.color }}></div>
                     </div>
                     <span className="text-muted tiny fw-bold">{med.remaining} days left</span>
                   </div>
                 </div>
               ))}
            </div>
            <button className="btn btn-link text-decoration-none p-0 mt-3 small fw-bold">View History</button>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card-custom shadow-sm border-0 rounded-4 p-4 h-100">
            <h5 className="fw-bold text-dark mb-4">Recent Health Activity</h5>
            <div className="activity-feed-new">
              <div className="activity-item-v2 mb-4">
                <div className="activity-dot info">
                  <Bell size={16} />
                </div>
                <div className="ps-4 position-relative border-start">
                  <p className="text-dark mb-1">Lab results for <strong className="text-primary">Blood Work</strong> are now available.</p>
                  <span className="text-muted small">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item-v2">
                <div className="activity-dot success">
                  <History size={16} />
                </div>
                <div className="ps-4 position-relative border-start">
                  <p className="text-dark mb-1">Payment for last visit was processed successfully.</p>
                  <span className="text-muted small">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .patient-dashboard-v2 {
          background-color: var(--bg-main);
          min-height: 100vh;
        }

        .date-chip-new {
          padding: 0.6rem 1.25rem;
          background: white;
          border-radius: 100px;
          border: 1px solid #f1f5f9;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #475569;
        }

        .hero-card {
           background: white;
           background-image: radial-gradient(at 100% 0%, #eff6ff 0%, transparent 40%);
        }

        .badge-ai-new {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          background: #f5f3ff;
          color: #8b5cf6;
          border: 1px solid #ddd6fe;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .hero-stats-grid-new {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .mini-stat-card-new {
          padding: 1rem;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #f8fafc;
        }

        .icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mini-stat-card-new .val { font-size: 1.1rem; font-weight: 700; display: block; }
        .mini-stat-card-new .unit { font-size: 0.75rem; color: #94a3b8; }

        .card-custom { background: white; }

        .pulse-dot-new {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          position: relative;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .doctor-avatar-circle {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .doctor-card-new { background: white; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .doctor-card-new:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.06) !important; }

        .doctor-image-v2 {
          width: 100%;
          height: 190px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .rating-badge-new {
          position: absolute;
          top: 12px;
          right: 12px;
          background: white;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          color: #1e293b;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }

        .meta-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .meta-cell { display: flex; align-items: center; font-size: 0.75rem; color: #64748b; font-weight: 500; }

        .med-card-new {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 1.15rem;
          border-radius: 18px;
        }

        .med-icon-v2 {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-custom {
          width: 60px;
          height: 5px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-bar-inner { height: 100%; border-radius: inherit; }

        .activity-dot {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: -18px;
          background: white;
          z-index: 2;
          box-shadow: 0 4px 8px rgba(0,0,0,0.04);
          border: 1px solid #f1f5f9;
        }

        .activity-dot.info { color: #3b82f6; }
        .activity-dot.success { color: #10b981; }

        .activity-item-v2 { position: relative; }
        .border-start { border-color: #f1f5f9 !important; border-width: 2px !important; }

        .fw-500 { font-weight: 500; }
        .tiny { font-size: 0.7rem; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
