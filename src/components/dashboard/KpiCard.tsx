"use client";

import React from "react";

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  accentColor?: string;
}

export function KpiCard({ icon, label, value, subtitle, accentColor = "var(--coco-caramel)" }: KpiCardProps) {
  return (
    <div className="dashboard-kpi-card">
      <div className="kpi-icon" style={{ color: accentColor, background: `${accentColor}15` }}>
        {icon}
      </div>
      <div className="kpi-content">
        <span className="kpi-label">{label}</span>
        <span className="kpi-value">{value}</span>
        {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
