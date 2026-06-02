"use client";

import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  distribucion: Record<number, number>;
}

const SCORE_COLORS = {
  1: { bg: "rgba(229, 115, 115, 0.85)", border: "#E57373" },
  2: { bg: "rgba(255, 183, 77, 0.85)", border: "#FFB74D" },
  3: { bg: "rgba(255, 213, 79, 0.85)", border: "#FFD54F" },
  4: { bg: "rgba(174, 213, 129, 0.85)", border: "#AED581" },
  5: { bg: "rgba(129, 199, 132, 0.85)", border: "#81C784" },
};

const SCORE_LABELS: Record<number, string> = {
  1: "No me gusta nada",
  2: "No me gusta",
  3: "Neutral",
  4: "Me gusta",
  5: "Me gusta mucho",
};

export function DoughnutChart({ distribucion }: DoughnutChartProps) {
  const labels = [1, 2, 3, 4, 5].map((s) => `${s} — ${SCORE_LABELS[s]}`);
  const values = [1, 2, 3, 4, 5].map((s) => distribucion[s] || 0);
  const total = values.reduce((a, b) => a + b, 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [1, 2, 3, 4, 5].map((s) => SCORE_COLORS[s as keyof typeof SCORE_COLORS].bg),
        borderColor: [1, 2, 3, 4, 5].map((s) => SCORE_COLORS[s as keyof typeof SCORE_COLORS].border),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 11, family: "'Inter', sans-serif" },
          color: "#3E2723",
        },
      },
      tooltip: {
        backgroundColor: "#3E2723",
        titleFont: { family: "'Inter', sans-serif", weight: 600 as const },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { label: string; raw: unknown }) => {
            const val = ctx.raw as number;
            const pct = total > 0 ? Math.round((val / total) * 100) : 0;
            return ` ${val} evaluadores (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="dashboard-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="2">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          Distribución de Scores
        </h3>
        <p className="chart-subtitle">{total} evaluadores</p>
      </div>
      <div style={{ height: "320px", padding: "0.5rem 0" }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
