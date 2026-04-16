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
    <div className="all-appointments container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold text-dark mb-1">Master Appointment Schedule</h1>
          <p className="text-muted mb-0">Global view across all doctors and patients</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm">
          <Download size={18} />
          <span>Export Schedule</span>
        </button>
      </div>

      <div className="card-custom border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-controls p-4 bg-white border-bottom d-flex gap-3">
          <div className="search-box-new flex-grow-1">
            <Search size={18} className="search-icon" />
            <input type="text" className="form-control ps-5 py-2 rounded-3 border-light-subtle" placeholder="Search by ID, Patient or Doctor..." />
          </div>
          <div className="date-filter-new h-100">
            <div className="input-group">
              <span className="input-group-text bg-white border-light-subtle rounded-start-3">
                <Calendar size={18} className="text-muted" />
              </span>
              <input type="date" className="form-control border-light-subtle rounded-end-3 py-2" />
            </div>
          </div>
          <button className="btn btn-light border-light-subtle rounded-3 px-3">
            <Filter size={18} className="text-muted" />
          </button>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Loader2 className="animate-spin text-primary" size={40} />
              <span className="ms-3 text-muted">Loading appointment records...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No appointments found in the system.</p>
            </div>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light-subtle text-muted text-uppercase small fw-bold">
                <tr>
                  <th className="ps-4 py-3">Appt. ID</th>
                  <th className="py-3">Patient Details</th>
                  <th className="py-3">Medical Professional</th>
                  <th className="py-3">Schedule</th>
                  <th className="py-3">Specialty</th>
                  <th className="py-3">Status</th>
                  <th className="pe-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="ps-4">
                      <span className="appt-id-badge">{apt.id}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-small p-bg text-white">
                          {apt.patientName?.charAt(0)}
                        </div>
                        <span className="fw-bold text-dark">{apt.patientName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-small d-bg text-white">
                          {apt.doctorName?.charAt(0)}
                        </div>
                        <span className="text-secondary">{apt.doctorName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="schedule-info">
                        <div className="d-flex align-items-center gap-1 small text-muted">
                          <Calendar size={12} />
                          <span>{new Date(apt.appointmentDateTime).toLocaleDateString()}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1 small fw-bold text-dark">
                          <Clock size={12} />
                          <span>{new Date(apt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="specialty-tag">{apt.specialty}</span>
                    </td>
                    <td>
                      <div className={`status-pill-new ${(apt.status || "PENDING").toLowerCase()}`}>
                        {apt.status === "CONFIRMED" && <CheckCircle2 size={12} className="me-1" />}
                        {apt.status === "PENDING" && <AlertCircle size={12} className="me-1" />}
                        {apt.status === "CANCELLED" && <XCircle size={12} className="me-1" />}
                        <span>{apt.status}</span>
                      </div>
                    </td>
                    <td className="pe-4">
                      <button className="btn btn-light btn-sm rounded-circle shadow-none border-0 p-2">
                        <MoreHorizontal size={18} className="text-muted" />
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
          background-color: var(--bg-main);
          min-height: 100vh;
        }

        .card-custom {
          background: white;
        }

        .search-box-new {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .appt-id-badge {
          font-family: 'JetBrains Mono', monospace;
          background: #f1f5f9;
          color: #475569;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .p-bg { background: linear-gradient(135deg, #10b981, #059669); }
        .d-bg { background: linear-gradient(135deg, #3b82f6, #2563eb); }

        .specialty-tag {
          font-size: 0.75rem;
          background: #f8fafc;
          padding: 4px 10px;
          border-radius: 6px;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .status-pill-new {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-pill-new.confirmed { background: #ecf3ff; color: #2563eb; }
        .status-pill-new.pending { background: #fff7ed; color: #f59e0b; }
        .status-pill-new.completed { background: #ecfdf5; color: #10b981; }
        .status-pill-new.cancelled { background: #fef2f2; color: #ef4444; }

        .form-control:focus {
          border-color: #3b82f633;
          box-shadow: 0 0 0 4px #3b82f61a;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
