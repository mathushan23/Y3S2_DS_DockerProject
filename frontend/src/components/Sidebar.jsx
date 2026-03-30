import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, Calendar, Video, LayoutDashboard, LogOut, Shield, Settings, HelpCircle } from "lucide-react";

export default function Sidebar() {
  const { logout, user } = useAuth();

  const links = [
    { id: "dashboard", label: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { id: "doctors", label: "Doctors", path: "/doctors", icon: <Users size={20} /> },
    { id: "appointments", label: "Appointments", path: "/appointments", icon: <Calendar size={20} /> },
    { id: "telemedicine", label: "Telemedicine", path: "/telemedicine", icon: <Video size={20} /> },
  ];

  if (user?.role === "ADMIN") {
    links.push({ id: "users", label: "User Management", path: "/users", icon: <Shield size={20} /> });
  }

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: "2.5rem", padding: "0.5rem" }}>
        <p className="eyebrow" style={{ color: "#64748b", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em" }}>MAIN MENU</p>
        
        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div style={{ padding: "0.5rem" }}>
        <p className="eyebrow" style={{ color: "#64748b", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em" }}>SUPPORT</p>
        <nav className="sidebar-nav">
          <NavLink to="/settings" className="nav-link">
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
          <NavLink to="/help" className="nav-link">
            <HelpCircle size={20} />
            <span>Help Center</span>
          </NavLink>
        </nav>
      </div>

      <div style={{ marginTop: "auto", padding: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
        <button 
          onClick={logout} 
          className="nav-link" 
          style={{ width: "100%", color: "#f87171", background: "transparent", border: "none", cursor: "pointer" }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

