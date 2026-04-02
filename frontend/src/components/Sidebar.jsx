import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, Calendar, Video, LayoutDashboard, LogOut, Shield, Settings, HelpCircle } from "lucide-react";
import { Nav, Navbar, Container, Button } from 'react-bootstrap';

export default function Sidebar() {
  const { logout, user } = useAuth();

  const links = [
    { id: "dashboard", label: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { id: "prescriptions", label: "Prescriptions", path: "/prescriptions", icon: <Calendar size={20} /> },
    { id: "appointments", label: "Appointments", path: "/appointments", icon: <Calendar size={20} /> },
    { id: "telemedicine", label: "Telemedicine", path: "/telemedicine", icon: <Video size={20} /> },
    { id: "availability", label: "Availability", path: "/availability", icon: <Video size={20} /> },
    { id: "patientreport", label: "PatientReport", path: "/patientreport", icon: <Video size={20} /> },
    { id: "profile", label: "Profile", path: "/profile", icon: <Video size={20} /> },



  ];

  if (user?.role === "ADMIN") {
    links.push({ id: "users", label: "User Management", path: "/users", icon: <Shield size={20} /> });
  }

  return (
      <div className="sidebar d-flex flex-column vh-100 bg-dark text-white" style={{ width: '280px', position: 'fixed', left: 0, top: 0, zIndex: 1000 }}>
        <div className="flex-grow-1">
          <div className="p-3">
            <div className="mb-4">
              <p className="text-uppercase small fw-bold text-secondary mb-3">MAIN MENU</p>
              <Nav className="flex-column">
                {links.map((link) => (
                    <Nav.Link
                        key={link.id}
                        as={NavLink}
                        to={link.path}
                        className={({ isActive }) =>
                            `d-flex align-items-center gap-2 py-2 px-3 rounded mb-1 text-white text-decoration-none ${
                                isActive ? 'bg-primary bg-opacity-25 active' : 'hover-bg-light hover-bg-opacity-10'
                            }`
                        }
                        style={{
                          color: '#fff',
                          transition: 'all 0.2s ease',
                        }}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Nav.Link>
                ))}
              </Nav>
            </div>

            <div>
              <p className="text-uppercase small fw-bold text-secondary mb-3">SUPPORT</p>
              <Nav className="flex-column">
                <Nav.Link
                    as={NavLink}
                    to="/settings"
                    className="d-flex align-items-center gap-2 py-2 px-3 rounded mb-1 text-white text-decoration-none"
                    style={{ transition: 'all 0.2s ease' }}
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </Nav.Link>
                <Nav.Link
                    as={NavLink}
                    to="/help"
                    className="d-flex align-items-center gap-2 py-2 px-3 rounded mb-1 text-white text-decoration-none"
                    style={{ transition: 'all 0.2s ease' }}
                >
                  <HelpCircle size={20} />
                  <span>Help Center</span>
                </Nav.Link>
              </Nav>
            </div>
          </div>
        </div>

        <div className="p-3 border-top border-secondary border-opacity-25">
          <Button
              onClick={logout}
              variant="danger"
              size="sm"
              className="d-flex align-items-center gap-2 w-100 justify-content-start"
              style={{ background: 'transparent', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#f87171' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                e.currentTarget.style.borderColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
              }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>

        <style jsx>{`
        .hover-bg-light:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .nav-link.active {
          background-color: rgba(13, 110, 253, 0.25);
          color: #fff;
        }
      `}</style>
      </div>
  );
}