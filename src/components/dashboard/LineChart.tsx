"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { TimelinePoint } from "@/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface LineChartProps {
  data: TimelinePoint[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

export function LineChart({ data }: LineChartProps) {
  const chartData = {
    labels: data.map((d) => formatDate(d.date)),
    datasets: [
      {
        label: "Evaluaciones",
        data: data.map((d) => d.count),
        borderColor: "rgba(212, 165, 116, 1)",
        backgroundColor: "rgba(212, 165, 116, 0.1)",
        borderWidth: 2.5,
        pointBackgroundColor: "rgba(212, 165, 116, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Promedio",
        data: data.map((d) => d.promedio),
        borderColor: "rgba(62, 39, 35, 0.7)",
        backgroundColor: "rgba(62, 39, 35, 0.05)",
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: "rgba(62, 39, 35, 0.7)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          font: { size: 11, family: "'Inter', sans-serif" },
          color: "#8B6F47",
          maxRotation: 45,
        },
        grid: { display: false },
      },
      y: {
        type: "linear" as const,
        position: "left" as const,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { size: 11, family: "'Inter', sans-serif" },
          color: "#D4A574",
        },
        grid: {
          color: "rgba(232, 216, 200, 0.4)",
        },
        title: {
          display: true,
          text: "Evaluaciones",
          font: { size: 11, family: "'Inter', sans-serif", weight: 600 as const },
          color: "#D4A574",
        },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { size: 11, family: "'Inter', sans-serif" },
          color: "#3E2723",
        },
        grid: { drawOnChartArea: false },
        title: {
          display: true,
          text: "Promedio",
          font: { size: 11, family: "'Inter', sans-serif", weight: 600 as const },
          color: "#3E2723",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
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
      },
    },
  };

  return (
    <div className="dashboard-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Evolución Temporal
        </h3>
        <p className="chart-subtitle">Evaluaciones y promedio por día</p>
      </div>
      <div style={{ height: "300px", padding: "0.5rem 0" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
