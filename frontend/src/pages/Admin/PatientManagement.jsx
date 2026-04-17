import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  ChevronRight,
  Loader2
} from "lucide-react";
import api from "../../api";

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await api.get("/api/patients");
        setPatients(data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="patient-management container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold text-dark mb-1">Patient Management</h1>
          <p className="text-muted mb-0">Monitor and manage registered patients</p>
        </div>
        <div className="stats-mini-new d-flex gap-3">
          <div className="stat-pill-new border-0 shadow-sm">
            <span className="label text-muted">Total Patients</span>
            <span className="value text-dark">1,248</span>
          </div>
          <div className="stat-pill-new border-0 shadow-sm highlight">
            <span className="label text-white-50">New Today</span>
            <span className="value text-white">+12</span>
          </div>
        </div>
      </div>

      <div className="card-custom border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-controls p-4 bg-white border-bottom d-flex justify-content-between align-items-center">
          <div className="search-box-new flex-grow-1" style={{ maxWidth: '400px' }}>
            <Search size={18} className="search-icon" />
            <input type="text" className="form-control ps-5 py-2 rounded-3 border-light-subtle" placeholder="Search by name, email or ID..." />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-light border-light-subtle rounded-3 px-3">
              <Filter size={18} className="text-muted" />
            </button>
            <select className="form-select border-light-subtle rounded-3 py-2 px-4 shadow-none">
              <option>All Patients</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Loader2 className="animate-spin text-primary" size={40} />
              <span className="ms-3 text-muted">Loading patients...</span>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No patients registered in the system.</p>
            </div>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light-subtle text-muted text-uppercase small fw-bold">
                <tr>
                  <th className="ps-4 py-3">Patient</th>
                  <th className="py-3">Details</th>
                  <th className="py-3">Contact info</th>
                  <th className="py-3">DOB</th>
                  <th className="py-3">Status</th>
                  <th className="pe-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-circle-new shadow-sm">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="mb-0 fw-bold text-dark">{patient.firstName} {patient.lastName}</p>
                          <span className="text-muted small">PID-00{patient.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="patient-meta-new">
                        <span className="badge bg-light text-dark border border-light-subtle px-3 py-2 rounded-pill font-weight-normal">{patient.gender}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-details">
                        <div className="d-flex align-items-center gap-2">
                          <Mail size={12} className="text-primary" />
                          <span className="small text-muted">{patient.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={14} className="text-muted" />
                        <span className="small text-muted">{patient.dateOfBirth}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge-new active`}>
                        Active
                      </span>
                    </td>
                    <td className="pe-4">
                      <div className="d-flex gap-2">
                        <button className="btn btn-light btn-sm rounded-3 border ps-3 pe-3 py-2" title="View Records">
                          <FileText size={16} className="text-primary" />
                        </button>
                        <button className="btn btn-light btn-sm rounded-3 border py-2">
                          <MoreVertical size={16} className="text-muted" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`
        .patient-management {
          background-color: var(--bg-main);
          min-height: 100vh;
        }

        .card-custom {
          background: white;
        }

        .stat-pill-new {
          background: white;
          padding: 0.75rem 1.5rem;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          min-width: 140px;
        }

        .stat-pill-new.highlight {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .stat-pill-new .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .stat-pill-new .value {
          font-size: 1.25rem;
          font-weight: 800;
          margin-top: 2px;
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

        .avatar-circle-new {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .status-badge-new {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-badge-new.active { background: #ecfdf5; color: #10b981; }

        .form-select:focus, .form-control:focus {
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
