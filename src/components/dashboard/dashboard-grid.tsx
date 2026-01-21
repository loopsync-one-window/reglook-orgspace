"use client";

import ProfileCard from "./profile-card";
import MetricsCard, { TrackersCard } from "./metrics-card";
import { Clock, CheckCircle } from "lucide-react";

export default function DashboardGrid() {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-500/20 overflow-hidden p-8">
      {/* Header with 3D effect */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none rounded-xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            <p className="text-sm text-gray-500 mt-0.5">Your performance metrics and status</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200/60 shadow-lg shadow-gray-400/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
            <ProfileCard />
          </div>
        </div>

        {/* Right Column - Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Row - Task Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-xl shadow-lg shadow-blue-500/30">
              <MetricsCard
                title="Prioritized tasks"
                percentage="83%"
                subtitle="Avg. Completed"
                gradient="from-white via-blue-600 to-blue-100"
                icon={<Clock className="h-4 w-4 text-white" />}
              />
            </div>
            <div className="relative overflow-hidden rounded-xl shadow-lg shadow-orange-500/30">
              <MetricsCard
                title="Additional tasks"
                percentage="56%"
                subtitle="Avg. Completed"
                gradient="from-white via-orange-600 to-orange-100"
                icon={<CheckCircle className="h-4 w-4 text-white" />}
              />
            </div>
          </div>

          {/* Bottom Row - Trackers */}
          <div className="w-full bg-white rounded-xl border border-gray-200/60 shadow-lg shadow-gray-400/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none"></div>
            <TrackersCard />
          </div>
        </div>
      </div>
    </div>
  );
}
