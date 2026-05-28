"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { QuestionAverage } from "@/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarChartProps {
  data: QuestionAverage[];
}

function getBarColor(promedio: number): string {
  if (promedio >= 4) return "rgba(129, 199, 132, 0.85)";
  if (promedio >= 3) return "rgba(255, 213, 79, 0.85)";
  if (promedio >= 2) return "rgba(255, 183, 77, 0.85)";
  return "rgba(229, 115, 115, 0.85)";
}

function getBarBorder(promedio: number): string {
  if (promedio >= 4) return "#81C784";
  if (promedio >= 3) return "#FFD54F";
  if (promedio >= 2) return "#FFB74D";
  return "#E57373";
}

export function BarChart({ data }: BarChartProps) {
  const sorted = [...data].sort((a, b) => b.promedio - a.promedio);
  const topItems = sorted.slice(0, 15);

  const chartData = {
    labels: topItems.map((d) => d.text),
    datasets: [
      {
        label: "Promedio",
        data: topItems.map((d) => d.promedio),
        backgroundColor: topItems.map((d) => getBarColor(d.promedio)),
        borderColor: topItems.map((d) => getBarBorder(d.promedio)),
        borderWidth: 1.5,
        borderRadius: 6,
        barThickness: 22,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    scales: {
      x: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          font: { size: 11, family: "'Inter', sans-serif" },
          color: "#8B6F47",
        },
        grid: {
          color: "rgba(232, 216, 200, 0.4)",
        },
      },
      y: {
        ticks: {
          font: { size: 11, family: "'Inter', sans-serif" },
          color: "#3E2723",
        },
        grid: { display: false },
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
          label: (ctx: { raw: unknown }) => ` Promedio: ${(ctx.raw as number).toFixed(2)} / 5`,
        },
      },
    },
  };

  return (
    <div className="dashboard-chart-card">
      <div className="chart-header">
        <h3 className="chart-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--coco-caramel)" strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Ranking de Atributos
        </h3>
        <p className="chart-subtitle">Ordenados de mejor a peor evaluado</p>
      </div>
      <div style={{ height: `${Math.max(300, topItems.length * 36)}px`, padding: "0.5rem 0" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
