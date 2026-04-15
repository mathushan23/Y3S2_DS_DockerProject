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
    <div className="patient-dashboard-v2 animate-fade-in">
      {/* Welcome Header */}
      <header className="welcome-section mb-5">
        <div className="d-flex justify-content-between align-items-end">
          <div>
            <h1 className="display-5 fw-bold mb-1">
              Welcome, <span className="gradient-text">{user?.fullName?.split(" ")[0] || "Patient"}</span>
            </h1>
            <p className="text-white-50 fs-5 mb-0">Your personalized health sanctuary is updated and ready.</p>
          </div>
          <div className="date-chip">
            <Calendar size={18} className="me-2 text-primary" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <div className="row g-4 mb-5">
        {/* Main Stats */}
        <div className="col-lg-8">
          <div className="glass-panel main-hero">
            <div className="row h-100 align-items-center">
              <div className="col-md-7">
                <div className="badge-ai mb-3">
                  <Sparkles size={14} className="me-2" />
                  AI-Powered Health Analysis
                </div>
                <h2 className="fw-bold mb-3 h1">Connect with the best medical minds.</h2>
                <p className="text-white-50 mb-4">
                  Schedule virtual or in-person visits with verified professionals. Your health metrics are within normal range.
                </p>
                <div className="d-flex gap-2">
                  <button className="btn-premium" onClick={() => navigate("/appointments")}>
                    Book Appointment
                  </button>
                  <button className="btn-glass" onClick={() => navigate("/symptom-checker")}>
                    Check Symptoms
                  </button>
                </div>
              </div>
              <div className="col-md-5 d-none d-md-block">
                <div className="hero-stats-grid">
                  {stats.map((stat, i) => (
                    <div key={i} className="mini-stat-card">
                      <div className="icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>{stat.icon}</div>
                      <span className="val">{stat.value}</span>
                      <span className="unit">{stat.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications / Next Appt */}
        <div className="col-lg-4">
          <div className="glass-panel next-appt h-100">
            <div className="panel-header mb-4">
              <h5 className="mb-0 fw-bold">Up Next</h5>
              <div className="pulse-dot"></div>
            </div>
            <div className="appt-card-mini mb-4">
              <div className="d-flex gap-3 mb-3">
                <div className="doctor-avatar-mini">SM</div>
                <div>
                  <h6 className="mb-0">Dr. Sarah Miller</h6>
                  <p className="text-white-50 small mb-0">Cardiology Specialist</p>
                </div>
              </div>
              <div className="time-info p-3 mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Calendar size={14} className="text-primary" />
                  <span className="small fw-semibold">October 24, 2024</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span className="small fw-semibold">10:30 AM (Online)</span>
                </div>
              </div>
              <button className="btn-outline-glass w-100">
                <Video size={16} className="me-2" />
                Join Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Doctors Section */}
      <section className="recommended-doctors mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1">Top Medical Professionals</h3>
            <p className="text-white-50 small">Based on your health profile and recent activity</p>
          </div>
          <button className="text-primary btn-link-premium">
            Browse All <ChevronRight size={18} />
          </button>
        </div>

        <div className="doctor-scroll-container">
          {loading ? (
            <div className="d-flex justify-content-center py-5 w-100">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : doctors.length === 0 ? (
            <div className="empty-state p-5 text-center w-100">
              <Stethoscope size={48} className="text-white-10 mb-3" />
              <p className="text-white-50">No medical professionals available currently.</p>
            </div>
          ) : (
            <div className="row g-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="col-md-4 col-lg-3">
                  <div className="doctor-card-premium">
                    <div className="doctor-image-wrapper">
                      <img 
                        src={doctor.profilePhotoUrl || getDoctorImg(doctor.gender, doctor.id)} 
                        alt={doctor.fullName} 
                        className="doctor-img"
                      />
                      <div className="rating-badge">
                        <Star size={12} className="fill-warning text-warning me-1" />
                        {doctor.averageRating || "4.8"}
                      </div>
                    </div>
                    <div className="doctor-info p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="doctor-name mb-0">{doctor.fullName}</h6>
                          <p className="specialty-text mb-0">{doctor.specialty}</p>
                        </div>
                        <div className="verified-check">
                          <Activity size={12} />
                        </div>
                      </div>
                      
                      <div className="doctor-meta-grid mb-3">
                        <div className="meta-item">
                           <Users size={12} className="me-1" />
                           <span>{doctor.totalPatients || 0}+ patients</span>
                        </div>
                        <div className="meta-item">
                           <MapPin size={12} className="me-1" />
                           <span>{doctor.clinicName || "City Clinic"}</span>
                        </div>
                      </div>

                      <button 
                        className="btn-book-mini w-100"
                        onClick={() => navigate(`/appointments?doctorId=${doctor.id}`)}
                      >
                        Book Now
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
          <div className="glass-panel">
            <h5 className="fw-bold mb-4">Active Prescriptions</h5>
            <div className="prescription-feed">
               {[
                 { name: "Metformin", dosage: "500mg", schedule: "Twice Daily", remaining: 12 },
                 { name: "Atorvastatin", dosage: "20mg", schedule: "Bedtime", remaining: 24 }
               ].map((med, i) => (
                 <div key={i} className="med-item-v2">
                   <div className="med-icon">
                     <Pill size={20} />
                   </div>
                   <div className="flex-grow-1">
                     <h6 className="mb-0">{med.name}</h6>
                     <span className="text-white-50 small">{med.dosage} • {med.schedule}</span>
                   </div>
                   <div className="med-status">
                     <div className="progress-mini">
                       <div className="progress-bar" style={{ width: `${(med.remaining/30)*100}%` }}></div>
                     </div>
                     <span className="text-white-50 tiny">{med.remaining} days left</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-panel">
            <h5 className="fw-bold mb-4">Recent Health Log</h5>
            <div className="notification-list">
              <div className="notif-item">
                <div className="notif-icon info"><Bell size={16} /></div>
                <div className="notif-body">
                  <p className="mb-0">Lab results for <strong>Blood Work</strong> are now available.</p>
                  <span className="tiny text-white-50">2 hours ago</span>
                </div>
              </div>
              <div className="notif-item">
                <div className="notif-icon success"><History size={16} /></div>
                <div className="notif-body">
                  <p className="mb-0">Payment for last visit was processed successfully.</p>
                  <span className="tiny text-white-50">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .patient-dashboard-v2 {
          color: #fff;
          padding-bottom: 3rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .date-chip {
          padding: 0.6rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          font-weight: 500;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 2rem;
          transition: transform 0.3s ease;
        }

        .main-hero {
          background: 
            radial-gradient(circle at top right, rgba(59, 130, 246, 0.15), transparent),
            linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          position: relative;
          overflow: hidden;
        }

        .badge-ai {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          background: rgba(167, 139, 250, 0.15);
          color: #a78bfa;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .btn-premium {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #fff;
          border: none;
          padding: 0.8rem 1.75rem;
          border-radius: 16px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
        }

        .btn-premium:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(37, 99, 235, 0.4);
        }

        .btn-glass {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.8rem 1.75rem;
          border-radius: 16px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-glass:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .hero-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .mini-stat-card {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          text-align: center;
        }

        .mini-stat-card .icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mini-stat-card .val { font-size: 1.25rem; font-weight: 800; display: block; }
        .mini-stat-card .unit { font-size: 0.75rem; color: rgba(255,255,255,0.4); }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          position: relative;
        }

        .pulse-dot::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: inherit;
          border-radius: inherit;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3.5); opacity: 0; }
        }

        .doctor-card-premium {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s ease;
          position: relative;
        }

        .doctor-card-premium:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .doctor-image-wrapper {
          height: 180px;
          position: relative;
          overflow: hidden;
        }

        .doctor-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .doctor-card-premium:hover .doctor-img {
          transform: scale(1.1);
        }

        .rating-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
        }

        .verified-check {
          background: #3b82f6;
          color: #fff;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: glow 2s infinite alternate;
        }

        @keyframes glow {
          from { box-shadow: 0 0 2px #3b82f6; }
          to { box-shadow: 0 0 8px #3b82f6; }
        }

        .doctor-name { font-weight: 700; color: #fff; }
        .specialty-text { font-size: 0.8rem; color: #60a5fa; font-weight: 600; }

        .doctor-meta-grid {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .btn-book-mini {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 0.6rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .doctor-card-premium:hover .btn-book-mini {
          background: #3b82f6;
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .med-item-v2 {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          margin-bottom: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .med-icon {
          width: 44px;
          height: 44px;
          background: rgba(96, 165, 250, 0.1);
          color: #60a5fa;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-mini {
          width: 60px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .progress-bar {
          height: 100%;
          background: #3b82f6;
          border-radius: inherit;
        }

        .notif-item {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .notif-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-icon.info { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .notif-icon.success { background: rgba(16, 185, 129, 0.15); color: #10b981; }

        .tiny { font-size: 0.7rem; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
