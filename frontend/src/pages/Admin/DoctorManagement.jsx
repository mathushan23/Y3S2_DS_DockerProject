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
        <div className="doctor-management container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div>
                    <h1 className="fw-bold text-dark mb-1">Doctor Management</h1>
                    <p className="text-muted mb-0">View and manage medical professional accounts</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm">
                    <Plus size={18} />
                    <span>Add New Doctor</span>
                </button>
            </div>

            <div className="card-custom border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-controls p-4 bg-white border-bottom d-flex justify-content-between align-items-center">
                    <div className="search-box-new flex-grow-1" style={{ maxWidth: '400px' }}>
                        <Search size={18} className="search-icon" />
                        <input type="text" className="form-control ps-5 py-2 rounded-3 border-light-subtle" placeholder="Search doctors by name or specialty..." />
                    </div>
                    <div className="filter-group d-flex gap-2">
                        <button className="btn btn-light border-light-subtle rounded-3">
                            <Filter size={18} className="text-muted" />
                        </button>
                        <button onClick={fetchDoctors} className="btn btn-light border-light-subtle rounded-3">
                            <RefreshCw size={18} className="text-muted" />
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center py-5">
                            <Loader2 className="animate-spin text-primary" size={40} />
                            <span className="ms-3 text-muted">Loading medical professionals...</span>
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">No doctors found in the system.</p>
                            <button onClick={fetchDoctors} className="btn btn-outline-primary btn-sm rounded-pill px-4 mt-3">
                                <RefreshCw size={14} className="me-2" />
                                Retry Fetch
                            </button>
                        </div>
                    ) : (
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light-subtle text-muted text-uppercase small fw-bold">
                                <tr>
                                    <th className="ps-4 py-3">Doctor Name</th>
                                    <th className="py-3">Specialty</th>
                                    <th className="py-3">Contact info</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Analytics</th>
                                    <th className="pe-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map((doctor) => (
                                    <tr key={doctor.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="avatar-doctor shadow-sm">
                                                    {doctor.fullName?.charAt(0) || "D"}
                                                </div>
                                                <div>
                                                    <p className="mb-0 fw-bold text-dark">{doctor.fullName}</p>
                                                    <span className="text-muted small">ID: DOC-0{doctor.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="specialty-pill">{doctor.specialty}</span>
                                        </td>
                                        <td>
                                            <div className="contact-details">
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <Mail size={12} className="text-primary" />
                                                    <span className="small text-muted">{doctor.email}</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Phone size={12} className="text-success" />
                                                    <span className="small text-muted">{doctor.phone || "N/A"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge-new ${(doctor.verificationStatus || "inactive").toLowerCase()}`}>
                                                {doctor.verificationStatus || "Pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="analytics-pill d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-light border border-light-subtle">
                                                <span className="fw-bold text-dark">{doctor.totalPatients || 0}</span>
                                                <span className="text-muted small">pts.</span>
                                            </div>
                                        </td>
                                        <td className="pe-4">
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-light btn-sm rounded-3 shadow-none border-1" title="View Details">
                                                    <ArrowUpRight size={16} className="text-primary" />
                                                </button>
                                                <button className="btn btn-light btn-sm rounded-3 shadow-none border-1">
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
        .doctor-management {
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

        .avatar-doctor {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .specialty-pill {
          background: #eff6ff;
          color: #2563eb;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid #dbeafe;
        }

        .status-badge-new {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge-new.active { background: #ecfdf5; color: #10b981; }
        .status-badge-new.verified { background: #ecfdf5; color: #10b981; }
        .status-badge-new.pending { background: #fffbeb; color: #f59e0b; }
        .status-badge-new.inactive { background: #fef2f2; color: #ef4444; }

        .form-control:focus {
          border-color: #3b82f633;
          box-shadow: 0 0 0 4px #3b82f61a;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
