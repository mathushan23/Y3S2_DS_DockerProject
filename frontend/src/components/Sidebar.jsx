import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Clock3,
  FileHeart,
  UserCircle2,
  LogOut,
  Shield,
  Settings,
  LifeBuoy,
  Stethoscope,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Nav, Button } from "react-bootstrap";

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const { logout, user } = useAuth();

  const getMenuItems = () => {
    const role = user?.role;
    const commonItems = [
      { id: "dashboard", label: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> }
    ];

    const doctorItems = [
      { id: "prescriptions", label: "Prescriptions", path: "/prescriptions", icon: <FileText size={20} /> },
      { id: "profile", label: "Profile", path: "/profile", icon: <UserCircle2 size={20} /> },
      { id: "availability", label: "Availability", path: "/availability", icon: <Clock3 size={20} /> },
      { id: "patientreport", label: "Patient Report", path: "/patientreport", icon: <FileHeart size={20} /> }
    ];

    const patientItems = [
      { id: "appointments", label: "Appointments", path: "/appointments", icon: <CalendarDays size={20} /> },
      { id: "symptom-checker", label: "Symptom Checker", path: "/symptom-checker", icon: <Stethoscope size={20} /> },
      { id: "prescriptions", label: "My Prescriptions", path: "/prescriptions", icon: <FileText size={20} /> }
    ];

    const adminItems = [
      { id: "admin-dashboard", label: "Admin Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
      { id: "doctor-management", label: "Doctor Management", path: "/admin/doctor-management", icon: <Stethoscope size={20} /> },
      { id: "patient-management", label: "Patient Management", path: "/admin/patient-management", icon: <Users size={20} /> },
      { id: "all-appointments", label: "All Appointments", path: "/admin/all-appointments", icon: <CalendarDays size={20} /> }
    ];

    switch (role) {
      case "DOCTOR": return [...commonItems, ...doctorItems];
      case "PATIENT": return [...commonItems, ...patientItems];
      case "ADMIN": return [...adminItems];
      default: return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      <aside className={`smart-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="smart-sidebar-top">
          <div className="smart-sidebar-brand">
            <div className="brand-logo-circle">
              <Activity size={24} color="white" />
            </div>
            {!isCollapsed && (
              <div className="brand-text animate-fade-in">
                <h5 className="smart-brand-title mb-0">SmartHealth</h5>
                <p className="smart-brand-subtitle mb-0">Management</p>
              </div>
            )}
          </div>

          {/* <div className="smart-sidebar-user">
            <div className="smart-user-avatar shadow-sm">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {!isCollapsed && (
              <div className="smart-user-info animate-fade-in">
                <h6 className="mb-0 text-dark fw-bold">{user?.fullName?.split(" ")[0] || "Guest"}</h6>
                <p className="mb-0 text-primary fw-bold text-uppercase">{user?.role?.toLowerCase() || "member"}</p>
              </div>
            )}
          </div> */}
        </div>

        <div className="smart-sidebar-body mt-3">
          <div className="smart-sidebar-section">
            {!isCollapsed && (
              <p className="smart-sidebar-section-title px-3">
                {user?.role === "ADMIN" ? "Administrator" : "Menu Navigation"}
              </p>
            )}

            <Nav className="flex-column gap-2 px-2">
              {menuItems.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `smart-nav-link shadow-hover ${isActive ? "active" : ""}`
                  }
                  title={isCollapsed ? link.label : ""}
                >
                  <span className="smart-nav-icon">{link.icon}</span>
                  {!isCollapsed && <span className="smart-nav-text animate-fade-in">{link.label}</span>}
                </NavLink>
              ))}
            </Nav>
          </div>
        </div>

        <div className="smart-sidebar-footer">
          {/* <Nav className="flex-column gap-2 px-2 mb-3">
            <NavLink to="/settings" className="smart-nav-link secondary" title={isCollapsed ? "Settings" : ""}>
              <span className="smart-nav-icon"><Settings size={20} /></span>
              {!isCollapsed && <span className="smart-nav-text">Settings</span>}
            </NavLink>
          </Nav> */}

          <div className="px-2 pb-3">
            <Button onClick={logout} className="smart-logout-btn shadow-sm" title={isCollapsed ? "Sign Out" : ""}>
              <LogOut size={20} />
              {!isCollapsed && <span className="ms-2">Logout</span>}
            </Button>
          </div>

          {/* Sidebar Expand/Collapse Toggle at the bottom
          <button className="sidebar-bottom-toggle" onClick={toggleSidebar}>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button> */}
        </div>
      </aside>

      <style>{`
        .smart-sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          background: #000e2e;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          transition: var(--transition);
          overflow: hidden;
          color: white;
        }

        .smart-sidebar.collapsed {
          width: var(--sidebar-collapsed-width);
        }

        .smart-sidebar-top {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .smart-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-left: 0.5rem;
        }

        .brand-logo-circle {
           width: 38px;
           height: 38px;
           background: linear-gradient(135deg, #2563eb, #1e40af);
           border-radius: 10px;
           display: flex;
           align-items: center;
           justify-content: center;
           flex-shrink: 0;
           box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .smart-brand-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
        }

        .smart-brand-subtitle {
          font-size: 0.65rem;
          color: #93c5fd;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .smart-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .smart-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2563eb;
          color: #fff;
          font-weight: 700;
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        .smart-user-info p {
          font-size: 0.65rem;
          letter-spacing: 0.5px;
          margin-top: 1px;
          color: #93c5fd;
        }

        .smart-sidebar-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding-top: 1rem;
        }

        .smart-sidebar-section-title {
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }

        .smart-nav-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          color: #94a3b8;
          text-decoration: none !important;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .collapsed .smart-nav-link {
           justify-content: center;
           padding: 0.7rem;
        }

        .smart-nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
        }

        .smart-nav-link.active {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .smart-sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .smart-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.65rem;
          border-radius: 10px;
          background: rgba(229, 62, 62, 0.1) !important;
          border: 1px solid rgba(229, 62, 62, 0.2) !important;
          color: #fca5a5 !important;
          font-weight: 700 !important;
          font-size: 0.85rem !important;
        }

        .smart-logout-btn:hover {
          background: rgba(229, 62, 62, 0.2) !important;
          transform: translateY(-1px);
        }

        .sidebar-bottom-toggle {
           position: absolute;
           top: -16px;
           right: -8px;
           width: 32px;
           height: 32px;
           background: #ffffff;
           border: 1px solid #e2e8f0;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           color: #64748b;
           cursor: pointer;
           box-shadow: 0 4px 6px rgba(0,0,0,0.05);
           z-index: 10;
           transition: all 0.2s;
        }

        .sidebar-bottom-toggle:hover {
           background: #2563eb;
           color: white;
           border-color: #2563eb;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 991.98px) {
          .smart-sidebar {
            transform: translateX(-100%);
          }
          .smart-sidebar.active {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}