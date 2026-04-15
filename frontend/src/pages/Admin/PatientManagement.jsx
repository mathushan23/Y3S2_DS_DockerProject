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
    <div className="patient-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Patient Management</h2>
          <p className="text-white-50">Monitor and manage registered patients</p>
        </div>
        <div className="stats-mini d-flex gap-3">
          <div className="stat-pill">
            <span className="label">Total Patients</span>
            <span className="value">1,248</span>
          </div>
          <div className="stat-pill">
            <span className="label">New Today</span>
            <span className="value">+12</span>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <div className="table-controls d-flex justify-content-between mb-4">
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Search by name, email or ID..." />
          </div>
          <div className="d-flex gap-2">
            <button className="btn-icon">
              <Filter size={18} />
            </button>
            <select className="form-select-glass">
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
              <span className="ms-3 text-white-50">Loading patients...</span>
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-white-50">No patients registered in the system.</p>
            </div>
          ) : (
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Details</th>
                  <th>Contact info</th>
                  <th>DOB</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-circle">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="mb-0 fw-bold">{patient.firstName} {patient.lastName}</p>
                          <span className="text-white-50 small">PID-00{patient.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="patient-meta">
                        <span>{patient.gender}</span>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Mail size={12} className="text-white-50" />
                          <span className="small">{patient.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={14} className="text-white-50" />
                        <span className="small">{patient.dateOfBirth}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge active`}>
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="action-btn" title="View Records">
                          <FileText size={16} />
                        </button>
                        <button className="action-btn">
                          <MoreVertical size={16} />
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
          animation: fadeIn 0.8s ease-out;
        }

        .stat-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-pill .label {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          font-weight: 700;
        }

        .stat-pill .value {
          font-weight: 700;
          color: #fff;
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
          width: 350px;
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

        .form-select-glass {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #fff;
          border-radius: 12px;
          padding: 0.75rem 2.5rem 0.75rem 1rem;
          outline: none;
        }

        .custom-table {
          color: #fff;
          margin-bottom: 0;
        }

        .custom-table thead th {
          background: transparent;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 1.25rem 1rem;
        }

        .custom-table tbody td {
          padding: 1.25rem 1rem;
          vertical-align: middle;
          border: none;
        }

        .avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .patient-meta {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.active { background: rgba(52, 211, 153, 0.1); color: #34d399; }
        .status-badge.inactive { background: rgba(255, 255, 255, 0.05); color: rgba(255,255,255,0.4); }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #3b82f6;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
