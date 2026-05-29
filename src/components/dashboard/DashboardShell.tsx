"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/server/supabase/client";

interface DashboardShellProps {
  children: React.ReactNode;
  userEmail: string;
  userRole: string;
}

export function DashboardShell({ children, userEmail, userRole }: DashboardShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const roleBadge = userRole === "admin" ? "Admin" : "Nutricionista";
  const roleColor = userRole === "admin" ? "#D4A574" : "#81C784";

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="dashboard-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">B</div>
            <div className="sidebar-logo-text">
              <span className="sidebar-brand">Budín Nutritivo</span>
              <span className="sidebar-tagline">Panel de Resultados</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">MENÚ</span>
          <Link href="/dashboard" className="sidebar-link active" onClick={() => setSidebarOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <Link href="/evaluar" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2" />
              <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" />
            </svg>
            Volver al Inicio
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-email">{userEmail}</span>
              <span className="sidebar-user-role" style={{ color: roleColor }}>
                {roleBadge}
              </span>
            </div>
          </div>
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Cerrar sesión"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="dashboard-main">
        {/* Top bar (mobile) */}
        <header className="dashboard-topbar">
          <button
            className="topbar-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="topbar-title">
            <span className="sidebar-brand" style={{ fontSize: "1.05rem" }}>Budín Nutritivo</span>
          </div>
          <div
            className="topbar-role-badge"
            style={{ background: `${roleColor}20`, color: roleColor }}
          >
            {roleBadge}
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}
