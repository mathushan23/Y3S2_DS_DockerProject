import React, { useEffect, useState } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    UserCheck,
    UserX,
    Mail,
    Phone,
    ArrowUpRight,
    Plus,
    Loader2,
    RefreshCw
} from "lucide-react";
import api from "../../api";

export default function DoctorManagement() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const data = await api.get("/api/doctors");
            setDoctors(data);
        } catch (err) {
            console.error("Failed to fetch doctors:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <div className="doctor-management">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Doctor Management</h2>
                    <p className="text-white-50">View and manage medical professional accounts</p>
                </div>
                <button className="btn-premium">
                    <Plus size={18} className="me-2" />
                    Add New Doctor
                </button>
            </div>

            <div className="glass-panel">
                <div className="table-controls d-flex justify-content-between mb-4">
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Search doctors by name or specialty..." />
                    </div>
                    <div className="filter-group">
                        <button className="btn-icon">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center py-5">
                            <Loader2 className="animate-spin text-primary" size={40} />
                            <span className="ms-3 text-white-50">Loading medical professionals...</span>
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-white-50">No doctors found in the system.</p>
                            <button onClick={fetchDoctors} className="btn-outline-glass btn-sm">
                                <RefreshCw size={14} className="me-2" />
                                Retry Fetch
                            </button>
                        </div>
                    ) : (
                        <table className="table custom-table ">
                            <thead>
                                <tr>
                                    <th>Doctor Name</th>
                                    <th>Specialty</th>
                                    <th>Contact info</th>
                                    <th>Status</th>
                                    <th>Analytics</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((doctor) => (
                                    <tr key={doctor.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="avatar-mini">
                                                    {doctor.fullName?.charAt(0) || "D"}
                                                </div>
                                                <div>
                                                    <p className="mb-0 fw-bold">{doctor.fullName}</p>
                                                    <span className="text-white-50 small">ID: DOC-0{doctor.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge-specialty">{doctor.specialty}</span>
                                        </td>
                                        <td>
                                            <div className="contact-info">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <Mail size={12} className="text-white-50" />
                                                    <span className="small">{doctor.email}</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Phone size={12} className="text-white-50" />
                                                    <span className="small">{doctor.phone || "N/A"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${(doctor.verificationStatus || "inactive").toLowerCase()}`}>
                                                {doctor.verificationStatus || "Pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="analytics-mini">
                                                <span className="fw-bold">{doctor.totalPatients || 0}</span>
                                                <span className="text-white-50 mx-1">pts.</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="action-btn" title="View Details">
                                                    <ArrowUpRight size={16} />
                                                </button>
                                                <button className="action-btn more">
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
        .doctor-management {
          animation: slideUp 0.6s ease-out;
        }

        .btn-premium {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          transition: all 0.3s;
          box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
        }

        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(37, 99, 235, 0.4);
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
          transition: all 0.3s;
        }

        .search-box input:focus {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(59, 130, 246, 0.5);
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

        .custom-table tbody tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: background 0.2s;
        }

        .custom-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .custom-table tbody td {
          padding: 1.25rem 1rem;
          vertical-align: middle;
          border: none;
        }

        .avatar-mini {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .badge-specialty {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.active { background: rgba(52, 211, 153, 0.1); color: #34d399; }
        .status-badge.inactive { background: rgba(239, 68, 68, 0.1); color: #f87171; }

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

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
