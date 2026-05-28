"use client";

import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import type { CategoryAverage } from "@/types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
  data: CategoryAverage[];
}

export function RadarChart({ data }: RadarChartProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Promedio",
        data: data.map((d) => d.promedio),
        backgroundColor: "rgba(212, 165, 116, 0.2)",
        borderColor: "rgba(212, 165, 116, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(212, 165, 116, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { size: 11, family: "'Inter', sans-serif" },
          color: "#8B6F47",
          backdropColor: "transparent",
        },
        grid: {
          color: "rgba(232, 216, 200, 0.6)",
        },
        angleLines: {
          color: "rgba(232, 216, 200, 0.6)",
        },
        pointLabels: {
          font: { size: 12, weight: 600 as const, family: "'Inter', sans-serif" },
          color: "#3E2723",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#3E2723",
        titleFont: { family: "'Inter', sans-serif", weight: 600 as const },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { parsed: { r: number } }) => ` Promedio: ${ctx.parsed.r.toFixed(2)} / 5`,
        },
      },
    },
  };

  return (
    <div className="dashboard-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="2">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            <line x1="12" y1="22" x2="12" y2="15.5" />
            <polyline points="22 8.5 12 15.5 2 8.5" />
          </svg>
          Promedios por Categoría
        </h3>
        <p className="chart-subtitle">Gráfico de araña — escala 1 a 5</p>
      </div>
      <div style={{ height: "320px", padding: "1rem 0" }}>
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
}
