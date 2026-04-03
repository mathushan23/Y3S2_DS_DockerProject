import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { HeartPulse, Bell, User, Search, ChevronRight } from "lucide-react";

export default function Layout() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
      <>
        <div className="smart-app-layout">
          <Sidebar />

          <div className="smart-main-wrapper">
            <header className="smart-top-header">
              <div className="smart-header-left">
                <div className="smart-page-brand">
                  <div className="smart-page-brand-icon">
                    <HeartPulse size={22} />
                  </div>
                  <div>
                    <h4 className="mb-0">SmartHealth</h4>
                    <p className="mb-0">Healthcare Management Dashboard</p>
                  </div>
                </div>

                <div className="smart-breadcrumb-mini">
                  <span>Dashboard</span>
                  <ChevronRight size={14} />
                  <span className="active">Overview</span>
                </div>
              </div>

              <div className="smart-header-right">
                <div className="smart-header-search">
                  <Search size={16} />
                  <input type="text" placeholder="Search..." />
                </div>

                {/*<button className="smart-icon-btn" type="button">*/}
                {/*  <Bell size={18} />*/}
                {/*  <span className="smart-notification-dot"></span>*/}
                {/*</button>*/}

                <div className="smart-profile-chip">
                  <div className="smart-profile-text">
                    <p className="smart-profile-name mb-0">
                      {user?.fullName || "Guest User"}
                    </p>
                    <p className="smart-profile-role mb-0">
                      {user?.role || "Member"}
                    </p>
                  </div>

                  <div className="smart-profile-avatar">
                    <User size={20} />
                  </div>
                </div>
              </div>
            </header>

            <section className="smart-page-content animate-fade-in">
              <Outlet />
            </section>
          </div>
        </div>

        <style>{`
        .smart-app-layout {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 20%),
            linear-gradient(180deg, #0b1220 0%, #111827 100%);
          color: #fff;
        }

        .smart-main-wrapper {
          margin-left: 280px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .smart-top-header {
          height: 88px;
          padding: 0 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 900;
          background: rgba(11, 18, 32, 0.75);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .smart-header-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.35rem;
        }

        .smart-page-brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .smart-page-brand-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(37,99,235,0.22), rgba(59,130,246,0.32));
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.16);
          box-shadow: 0 10px 24px rgba(0,0,0,0.2);
        }

        .smart-page-brand h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #ffffff;
        }

        .smart-page-brand p {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.52);
          margin-top: 2px;
        }

        .smart-breadcrumb-mini {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.48);
          padding-left: 3.6rem;
        }

        .smart-breadcrumb-mini .active {
          color: #cbd5e1;
          font-weight: 500;
        }

        .smart-header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .smart-header-search {
          width: 260px;
          height: 46px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0 0.95rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.55);
        }

        .smart-header-search input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 0.9rem;
        }

        .smart-header-search input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .smart-icon-btn {
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.25s ease;
        }

        .smart-icon-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }

        .smart-notification-dot {
          position: absolute;
          top: 10px;
          right: 11px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.6);
        }

        .smart-profile-chip {
          min-height: 52px;
          padding: 0.45rem 0.55rem 0.45rem 0.9rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .smart-profile-text {
          text-align: right;
        }

        .smart-profile-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }

        .smart-profile-role {
          font-size: 0.76rem;
          color: rgba(255, 255, 255, 0.55);
          text-transform: capitalize;
          margin-top: 3px;
        }

        .smart-profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 10px 22px rgba(37, 99, 235, 0.25);
        }

        .smart-page-content {
          flex: 1;
          padding: 1.8rem;
        }

        @media (max-width: 991.98px) {
          .smart-main-wrapper {
            margin-left: 280px;
          }

          .smart-header-search {
            display: none;
          }

          .smart-breadcrumb-mini {
            display: none;
          }
        }

        @media (max-width: 767.98px) {
          .smart-top-header {
            padding: 0 1rem;
            height: auto;
            min-height: 88px;
            flex-wrap: wrap;
            gap: 1rem;
            padding-top: 1rem;
            padding-bottom: 1rem;
          }

          .smart-header-left,
          .smart-header-right {
            width: 100%;
          }

          .smart-header-right {
            justify-content: space-between;
          }

          .smart-profile-text {
            text-align: left;
          }

          .smart-page-content {
            padding: 1rem;
          }
        }
      `}</style>
      </>
  );
}