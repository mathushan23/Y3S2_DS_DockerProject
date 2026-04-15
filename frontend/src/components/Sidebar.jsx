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
  Activity
} from "lucide-react";
import { Nav, Button } from "react-bootstrap";

export default function Sidebar() {
  const { logout, user } = useAuth();

  const links = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={19} />,
    },
    {
      id: "prescriptions",
      label: "Prescriptions",
      path: "/prescriptions",
      icon: <FileText size={19} />,
    },
    {
      id: "appointments",
      label: "Appointments",
      path: "/appointments",
      icon: <CalendarDays size={19} />,
    },
    {
      id: "availability",
      label: "Availability",
      path: "/availability",
      icon: <Clock3 size={19} />,
    },
    {
      id: "patientreport",
      label: "Patient Report",
      path: "/patientreport",
      icon: <FileHeart size={19} />,
    },
    {
      id: "profile",
      label: "Profile",
      path: "/profile",
      icon: <UserCircle2 size={19} />,
    },
  ];

  if (user?.role === "ADMIN") {
    links.push({
      id: "users",
      label: "User Management",
      path: "/users",
      icon: <Shield size={19} />,
    });
  }

  return (
    <>
      <aside className="smart-sidebar">
        <div className="smart-sidebar-top">
          <div className="smart-sidebar-brand">
            <div>
              <h5 className="smart-brand-title mb-0">SmartHealth</h5>
              {user?.role && (
                <p className="smart-brand-subtitle mb-0">
                  {user.role.charAt(0) + user.role.slice(1).toLowerCase()} Panel
                </p>
              )}
            </div>
          </div>

          <div className="smart-sidebar-user">
            <div className="smart-user-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="smart-user-info">
              <h6 className="mb-0">{user?.fullName || "Guest User"}</h6>
              <p className="mb-0">{user?.role || "Member"}</p>
            </div>
          </div>
        </div>

        <div className="smart-sidebar-body">
          <div className="smart-sidebar-section">
            <p className="smart-sidebar-section-title">
              {user?.role === "ADMIN" ? "ADMIN MENU" : "MAIN MENU"}
            </p>

            <Nav className="flex-column gap-1">
              {menuItems.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `smart-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="smart-nav-icon">{link.icon}</span>
                  <span className="smart-nav-text">{link.label}</span>
                </NavLink>
              ))}
            </Nav>
          </div>

          {/* Support section - show for all except maybe admin */}
          {user?.role !== "ADMIN" && (
            <div className="smart-sidebar-section mt-4">
              <p className="smart-sidebar-section-title">SUPPORT</p>
              <Nav className="flex-column gap-1">
                {supportItems.map((link) => (
                  <NavLink
                    key={link.id}
                    to={link.path}
                    className={({ isActive }) =>
                      `smart-nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    <span className="smart-nav-icon">{link.icon}</span>
                    <span className="smart-nav-text">{link.label}</span>
                  </NavLink>
                ))}
              </Nav>
            </div>
          )}
        </div>

        <div className="smart-sidebar-footer">
          <Button
            onClick={logout}
            className="smart-logout-btn"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      <style>{`
        .smart-sidebar {
          width: 280px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            linear-gradient(180deg, rgba(24, 28, 38, 0.98) 0%, rgba(14, 17, 24, 0.98) 100%);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(14px);
          color: #fff;
          overflow: hidden;
        }

        .smart-sidebar-top {
          padding: 1.25rem 1rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
        }

        .smart-sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.25rem;
        }

        .smart-brand-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: #fff;
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.35);
          flex-shrink: 0;
        }

        .smart-brand-title {
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.2px;
        }

        .smart-brand-subtitle {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.55);
          margin-top: 2px;
        }

        .smart-sidebar-user {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.8rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .smart-user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(59,130,246,0.22), rgba(37,99,235,0.35));
          color: #93c5fd;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
          border: 1px solid rgba(147, 197, 253, 0.18);
        }

        .smart-user-info h6 {
          color: #fff;
          font-size: 0.92rem;
          font-weight: 600;
        }

        .smart-user-info p {
          color: rgba(255, 255, 255, 0.55);
          font-size: 0.76rem;
          margin-top: 2px;
          text-transform: capitalize;
        }

        .smart-sidebar-body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .smart-sidebar-body::-webkit-scrollbar {
          width: 6px;
        }

        .smart-sidebar-body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
        }

        .smart-sidebar-section-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.42);
          letter-spacing: 1.1px;
          margin-bottom: 0.9rem;
          padding-left: 0.35rem;
        }

        .smart-nav-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.82rem 0.95rem;
          border-radius: 14px;
          color: rgba(255, 255, 255, 0.82);
          text-decoration: none;
          transition: all 0.25s ease;
          position: relative;
          border: 1px solid transparent;
        }

        .smart-nav-link:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.07);
          transform: translateX(2px);
        }

        .smart-nav-link.active {
          background: linear-gradient(90deg, rgba(37, 99, 235, 0.22), rgba(59, 130, 246, 0.10));
          color: #ffffff;
          border-color: rgba(59, 130, 246, 0.24);
          box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.08);
        }

        .smart-nav-link.active::before {
          content: "";
          position: absolute;
          left: -1rem;
          top: 10px;
          bottom: 10px;
          width: 4px;
          border-radius: 999px;
          background: #3b82f6;
          box-shadow: 0 0 18px rgba(59, 130, 246, 0.5);
        }

        .smart-nav-icon {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.04);
          color: inherit;
          transition: all 0.25s ease;
        }

        .smart-nav-link:hover .smart-nav-icon,
        .smart-nav-link.active .smart-nav-icon {
          background: rgba(255, 255, 255, 0.08);
        }

        .smart-nav-text {
          font-size: 0.93rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .smart-sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
        }

        .smart-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.7rem;
          padding: 0.85rem 0.95rem;
          border-radius: 14px;
          background: rgba(239, 68, 68, 0.08) !important;
          border: 1px solid rgba(239, 68, 68, 0.18) !important;
          color: #fca5a5 !important;
          box-shadow: none !important;
          transition: all 0.25s ease;
        }

        .smart-logout-btn:hover,
        .smart-logout-btn:focus,
        .smart-logout-btn:active {
          background: rgba(239, 68, 68, 0.14) !important;
          border-color: rgba(239, 68, 68, 0.3) !important;
          color: #fecaca !important;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}