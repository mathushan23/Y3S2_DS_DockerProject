import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { HeartPulse, Bell, User, Search, ChevronRight, Menu } from "lucide-react";

export default function Layout() {
  const { user, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className={`smart-app-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

        <div className="smart-main-wrapper">
          <header className="smart-top-header py-2">
            <div className="smart-header-left">
              <div className="d-flex align-items-center gap-3">
                {/* <button className="sidebar-toggle-btn shadow-sm" onClick={toggleSidebar}>
                  <Menu size={20} />
                </button> */}
                <div className="smart-page-brand">
                  {/* <div className="smart-page-brand-icon">
                    <HeartPulse size={22} />
                  </div> */}
                  <div>
                    <h4 className="mb-0">SmartHealth</h4>
                    <p className="mb-0">Healthcare Management</p>
                  </div>
                </div>
              </div>

              {/* <div className="smart-breadcrumb-mini">
                <span>Dashboard</span>
                <ChevronRight size={14} />
                <span className="active">Overview</span>
              </div> */}
            </div>

            <div className="smart-header-right">
              <div className="smart-header-search">
                <Search size={16} />
                <input type="text" placeholder="Search records..." />
              </div>

              <div className="smart-profile-chip shadow-sm">
                <div className="smart-profile-text">
                  <p className="smart-profile-name mb-0">
                    {user?.fullName || "Guest User"}
                  </p>
                  <p className="smart-profile-role mb-0 text-primary fw-bold">
                    {user?.role || "Member"}
                  </p>
                </div>

                <div className="smart-profile-avatar">
                  <User size={20} />
                </div>
              </div>
            </div>
          </header>

          <main className="smart-page-content animate-fade-in shadow-sm">
            <div className="content-container">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <style>{`
        :root {
          --sidebar-width: 280px;
          --sidebar-collapsed-width: 80px;
          --header-height: 72px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .smart-app-layout {
          min-height: 100vh;
          background: #f8fafc;
          overflow-x: hidden;
          display: flex;
        }

        .smart-main-wrapper {
          flex: 1;
          margin-left: var(--sidebar-width);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          transition: var(--transition);
          width: calc(100% - var(--sidebar-width));
        }

        .sidebar-collapsed .smart-main-wrapper {
          margin-left: var(--sidebar-collapsed-width);
          width: calc(100% - var(--sidebar-collapsed-width));
        }

        .smart-top-header {
          height: var(--header-height);
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #000e2e;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          width: 100%;
          color: white;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .smart-header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .smart-page-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .smart-page-brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: #000e2e;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .smart-page-brand h4 {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin: 0;
          line-height: 1.2;
        }

        .smart-page-brand p {
          font-size: 0.65rem;
          color: #94a3b8;
          margin: 0;
        }

        .smart-breadcrumb-mini {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #64748b;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding-left: 1.25rem;
          height: 32px;
        }

        .smart-breadcrumb-mini .active {
          color: #2563eb;
          font-weight: 600;
        }

        .smart-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .smart-header-search {
          width: 260px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0 0.85rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s;
        }

        .smart-header-search:focus-within {
          border-color: #2563eb;
          width: 300px;
        }

        .smart-header-search input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 0.8rem;
        }

        

        .smart-profile-chip {
          padding: 0.25rem 0.25rem 0.25rem 0.85rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          cursor: pointer;
          transition: all 0.2s;
        }

        .smart-profile-chip:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }

        .smart-profile-text { text-align: right; }
        .smart-profile-name { font-size: 0.8rem; font-weight: 600; color: white; line-height: 1.2; }
        .smart-profile-role { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px; color: #2563eb !important; font-weight: 800; }

        .smart-profile-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2563eb;
          color: #fff;
          box-shadow: 0 2px 5px rgba(37, 99, 235, 0.3);
        }

        .smart-page-content {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          overflow-x: hidden;
          background: #f8fafc;
        }

        .content-container {
           max-width: 1600px;
           margin: 0 auto;
           width: 100%;
        }

        @media (max-width: 991.98px) {
          .smart-main-wrapper {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .smart-header-search, .smart-breadcrumb-mini {
            display: none;
          }
        }

        @media (max-width: 767.98px) {
          .smart-top-header {
            padding: 0 1rem;
            height: auto;
            flex-wrap: nowrap;
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
           .smart-profile-text { display: none; }
        }
      `}</style>
    </>
  );
}
