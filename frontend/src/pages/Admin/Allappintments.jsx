import React, { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope,
  MoreHorizontal,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import api from "../../api";

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await api.get("/api/appointments");
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="all-appointments">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Master Appointment Schedule</h2>
          <p className="text-white-50">Global view across all doctors and patients</p>
        </div>
        <button className="btn-glass">
          <Download size={18} className="me-2" />
          Export Schedule
        </button>
      </div>

      <div className="glass-panel">
        <div className="table-controls d-flex gap-3 mb-4">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search by ID, Patient or Doctor..." />
          </div>
          <div className="date-filter">
             <Calendar size={18} className="icon-left" />
             <input type="date" className="date-input" />
          </div>
          <button className="btn-icon">
            <Filter size={18} />
          </button>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Loader2 className="animate-spin text-primary" size={40} />
              <span className="ms-3 text-white-50">Loading appointment records...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-white-50">No appointments found in the system.</p>
            </div>
          ) : (
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Appt. ID</th>
                  <th>Patient Details</th>
                  <th>Medical Professional</th>
                  <th>Schedule</th>
                  <th>Specialty</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <span className="appt-id">#{apt.id}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                         <div className="mini-avatar-p">
                           <User size={14} />
                         </div>
                         <span className="fw-bold">{apt.patientName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                         <div className="mini-avatar-d">
                           <Stethoscope size={14} />
                         </div>
                         <span>{apt.doctorName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="schedule-info">
                        <div className="d-flex align-items-center gap-1 small text-white-50">
                          <Calendar size={12} />
                          <span>{new Date(apt.appointmentDateTime).toLocaleDateString()}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1 small fw-600">
                          <Clock size={12} />
                          <span>{new Date(apt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="type-tag">{apt.specialty}</span>
                    </td>
                    <td>
                      <div className={`status-pill ${(apt.status || "PENDING").toLowerCase()}`}>
                         {apt.status === "CONFIRMED" && <CheckCircle2 size={12} className="me-1" />}
                         {apt.status === "PENDING" && <AlertCircle size={12} className="me-1" />}
                         {apt.status === "CANCELLED" && <XCircle size={12} className="me-1" />}
                         <span>{apt.status}</span>
                      </div>
                    </td>
                    <td>
                      <button className="action-btn-minimal">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`
        .all-appointments {
          animation: fadeIn 0.8s ease-out;
        }

        .btn-glass {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
          padding: 0.6rem 1.25rem;
          border-radius: 12px;
          backdrop-filter: blur(8px);
          transition: all 0.3s;
          display: flex;
          align-items: center;
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .search-box {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-box svg {
          position: absolute;
          left: 1rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .search-box input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #fff;
          outline: none;
        }

        .date-filter {
          position: relative;
          display: flex;
          align-items: center;
        }

        .icon-left {
          position: absolute;
          left: 1rem;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
        }

        .date-input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0.75rem 1rem 0.75rem 3rem;
          color: #fff;
          outline: none;
        }

        .appt-id {
          font-family: 'Monaco', monospace;
          color: #60a5fa;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .mini-avatar-p { background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 6px; border-radius: 8px; }
        .mini-avatar-d { background: rgba(139, 92, 246, 0.2); color: #a78bfa; padding: 6px; border-radius: 8px; }

        .type-tag {
          font-size: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.7);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-pill.confirmed { background: rgba(37, 99, 235, 0.15); color: #60a5fa; }
        .status-pill.pending { background: rgba(251, 146, 60, 0.15); color: #fb923c; }
        .status-pill.completed { background: rgba(52, 211, 153, 0.15); color: #34d399; }
        .status-pill.cancelled { background: rgba(239, 68, 68, 0.15); color: #f87171; }

        .action-btn-minimal {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.2s;
        }

        .action-btn-minimal:hover {
          color: #fff;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
