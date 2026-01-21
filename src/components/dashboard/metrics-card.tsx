"use client";

import { Clock, CheckCircle, MoreHorizontal } from "lucide-react";

interface MetricsCardProps {
  title: string;
  percentage: string;
  subtitle: string;
  gradient: string;
  icon: React.ReactNode;
}

export default function MetricsCard({ title, percentage, subtitle, gradient, icon }: MetricsCardProps) {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-lg p-6 relative overflow-hidden`}>
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-center mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-white drop-shadow-sm">{title}</h3>
      </div>

      {/* Percentage */}
      <div className="text-center mb-4 relative z-10">
        <div className="text-3xl font-bold text-white drop-shadow-sm">{percentage}</div>
        <div className="text-sm text-white drop-shadow-sm">{subtitle}</div>
      </div>

      {/* Icon */}
      <div className="flex justify-center relative z-10">
        <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center border border-white/40">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function TrackersCard() {
  // You can change this to "Present", "Absent", "Late", or "Off Day" based on actual data
  const attendanceStatus = "Present";

  // Color coding for attendance status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "text-green-600 bg-green-50 border-green-200";
      case "Absent":
        return "text-red-600 bg-red-50 border-red-200";
      case "Late":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Off Day":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="relative p-6">
      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center divide-x divide-gray-300">
          <div className="pr-6 flex flex-col justify-center">
            <h3 className="text-xs font-medium text-gray-600 mb-1">HQ Assigned ID</h3>
            <p className="text-sm font-semibold text-black">HQ-2026-001</p>
          </div>
          <div className="px-6 flex flex-col justify-center">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Last Login</h3>
            <p className="text-sm font-semibold text-black">10/8/2026, 10:45 AM</p>
          </div>
          <div className="pl-6 flex flex-col justify-center">
            <h3 className="text-xs font-medium text-gray-600 mb-1">Attendance</h3>
            <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full border ${getStatusColor(attendanceStatus)} shadow-sm`}>
              {attendanceStatus}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-md shadow-blue-500/30">
            Apply Leave
          </button>
          <button className="px-4 py-2 bg-green-600 cursor-pointer hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-md shadow-green-500/30">
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
