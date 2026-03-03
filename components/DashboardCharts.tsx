"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { Record, getRowAmount } from "@/lib/records";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

interface DashboardChartsProps {
  records: Record[];
}

export default function DashboardCharts({ records }: DashboardChartsProps) {
  const data = useMemo(() => {
    // group records by week and compute net for each week
    const weekMap: { [week: string]: number } = {};

    records.forEach((r) => {
      const d = new Date(r.date);
      const weekStart = new Date(d);
      const day = weekStart.getDay();
      const diff = (day + 6) % 7; // back to Monday
      weekStart.setDate(weekStart.getDate() - diff);
      const key = weekStart.toISOString().slice(0, 10);

      const amt = getRowAmount(r);
      weekMap[key] = (weekMap[key] || 0) + amt;
    });

    const weekKeys = Object.keys(weekMap).sort();
    const weeklyNets = weekKeys.map((k) => weekMap[k]);

    return {
      labels: weekKeys,
      datasets: [
        {
          label: "Weekly Net",
          data: weeklyNets,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.1)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: "#fff",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [records]);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: "top" as const,
        labels: {
          font: { size: 12, weight: 500 },
          padding: 12,
          usePointStyle: true,
        }
      },
      title: { 
        display: true, 
        text: "Weekly Net Trend",
        font: { size: 16, weight: 600 },
        padding: 16,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          callback: function (value: any) {
            return "DH " + value.toFixed(0);
          },
          font: { size: 12 },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="mt-6 lg:mt-8">
      <div className="card p-4 sm:p-6 lg:p-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-foreground">Weekly Comparison</h2>
        <div className="w-full h-96 sm:h-80 md:h-96 lg:h-112.5">
          <Line data={data} options={{ ...options, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
