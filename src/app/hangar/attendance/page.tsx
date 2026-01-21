"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Download, MoreHorizontal, Clock, Calendar, TrendingUp, Award, AlertCircle, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AttendanceRecord {
  id: string;
  date: string;
  dayOfWeek: string;
  clockIn: string | null;
  clockOut: string | null;
  totalHours: string | null;
  status: "Present" | "Absent" | "On Leave" | "Half Day";
  notes: string;
  employeeName: string;
}

// Mock data for October 2024
const mockAttendanceData: AttendanceRecord[] = [
  {
    id: "1",
    date: "October 19",
    dayOfWeek: "Saturday",
    clockIn: "09:00 AM",
    clockOut: "05:30 PM",
    totalHours: "08:30:29",
    status: "Present",
    notes: "-",
    employeeName: "John Doe",
  },
  {
    id: "2",
    date: "October 18",
    dayOfWeek: "Friday",
    clockIn: "09:10 AM",
    clockOut: "05:20 PM",
    totalHours: "08:10:02",
    status: "Present",
    notes: "Late Clock-In",
    employeeName: "John Doe",
  },
  {
    id: "3",
    date: "October 17",
    dayOfWeek: "Thursday",
    clockIn: "08:05 AM",
    clockOut: "05:45 PM",
    totalHours: "08:40:14",
    status: "Present",
    notes: "Worked overtime",
    employeeName: "John Doe",
  },
  {
    id: "4",
    date: "October 16",
    dayOfWeek: "Wednesday",
    clockIn: "09:15 AM",
    clockOut: "06:00 PM",
    totalHours: "08:45:31",
    status: "Present",
    notes: "Worked overtime",
    employeeName: "John Doe",
  },
  {
    id: "5",
    date: "October 15",
    dayOfWeek: "Tuesday",
    clockIn: null,
    clockOut: null,
    totalHours: null,
    status: "On Leave",
    notes: "Sick",
    employeeName: "John Doe",
  },
  {
    id: "6",
    date: "October 14",
    dayOfWeek: "Monday",
    clockIn: "09:00 AM",
    clockOut: "05:40 PM",
    totalHours: "08:40:35",
    status: "Present",
    notes: "-",
    employeeName: "John Doe",
  },
  {
    id: "7",
    date: "October 13",
    dayOfWeek: "Sunday",
    clockIn: "09:30 AM",
    clockOut: "05:35 PM",
    totalHours: "08:05:07",
    status: "Present",
    notes: "Late Clock-In",
    employeeName: "John Doe",
  },
  {
    id: "8",
    date: "October 12",
    dayOfWeek: "Saturday",
    clockIn: null,
    clockOut: null,
    totalHours: null,
    status: "Absent",
    notes: "-",
    employeeName: "John Doe",
  },
  {
    id: "9",
    date: "October 11",
    dayOfWeek: "Friday",
    clockIn: "09:10 AM",
    clockOut: "05:15 PM",
    totalHours: "08:05:17",
    status: "Present",
    notes: "Late Clock-In",
    employeeName: "John Doe",
  },
  {
    id: "10",
    date: "October 10",
    dayOfWeek: "Thursday",
    clockIn: "08:00 AM",
    clockOut: "05:45 PM",
    totalHours: "08:45:55",
    status: "Present",
    notes: "Worked overtime",
    employeeName: "John Doe",
  },
  {
    id: "11",
    date: "October 9",
    dayOfWeek: "Wednesday",
    clockIn: "09:05 AM",
    clockOut: "05:35 PM",
    totalHours: "08:30:15",
    status: "Present",
    notes: "Worked overtime",
    employeeName: "John Doe",
  },
  {
    id: "12",
    date: "October 8",
    dayOfWeek: "Tuesday",
    clockIn: "09:20 AM",
    clockOut: "05:25 PM",
    totalHours: "08:05:44",
    status: "Present",
    notes: "Late for meeting",
    employeeName: "John Doe",
  },
  {
    id: "13",
    date: "October 7",
    dayOfWeek: "Monday",
    clockIn: "09:00 AM",
    clockOut: "05:40 PM",
    totalHours: "08:40:12",
    status: "Present",
    notes: "-",
    employeeName: "John Doe",
  },
  {
    id: "14",
    date: "October 6",
    dayOfWeek: "Sunday",
    clockIn: null,
    clockOut: null,
    totalHours: null,
    status: "On Leave",
    notes: "Vacation",
    employeeName: "John Doe",
  },
  {
    id: "15",
    date: "October 5",
    dayOfWeek: "Saturday",
    clockIn: null,
    clockOut: null,
    totalHours: null,
    status: "On Leave",
    notes: "Vacation",
    employeeName: "John Doe",
  },
];

export default function AttendancePage() {
  const [currentMonth, setCurrentMonth] = useState("October");
  const [currentYear] = useState(2026);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [attendanceData] = useState<AttendanceRecord[]>(mockAttendanceData);
  const [activeTab, setActiveTab] = useState<"overview" | "records">("overview");

  // Calculate attendance statistics
  const presentDays = attendanceData.filter(record => record.status === "Present").length;
  const absentDays = attendanceData.filter(record => record.status === "Absent").length;
  const leaveDays = attendanceData.filter(record => record.status === "On Leave").length;
  const totalDays = attendanceData.length;
  const attendanceRate = Math.round((presentDays / totalDays) * 100);

  // Calculate average working hours
  const totalHours = attendanceData
    .filter(record => record.totalHours)
    .reduce((sum, record) => {
      if (record.totalHours) {
        const [hours, minutes] = record.totalHours.split(':').map(Number);
        return sum + hours + minutes / 60;
      }
      return sum;
    }, 0);
  const avgHours = (totalHours / presentDays).toFixed(1);

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === attendanceData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(attendanceData.map((r) => r.id)));
    }
  };

  const getStatusColor = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "Present":
        return "bg-purple-100 text-purple-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      case "On Leave":
        return "bg-orange-100 text-orange-700";
      case "Half Day":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
              <p className="text-gray-400 text-sm">Track your time and optimize your productivity</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-300">Current Month</div>
                  <div className="text-lg font-semibold">{currentMonth} {currentYear}</div>
                </div>
              </div>

              <div className="flex">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-l-xl border-r-0 border-white/20 bg-white/5 hover:bg-white/10 hover:text-white text-white"
                  onClick={() => {
                    // Handle previous month
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-r-xl border-white/20 bg-white/5 hover:bg-white/10 hover:text-white text-white"
                  onClick={() => {
                    // Handle next month
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Tab Navigation */}
      <div className="fixed top-[120px] left-0 right-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === "overview"
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${activeTab === "records"
                  ? "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
            >
              Attendance Records
            </button>
          </div>
        </div>
      </div>

      {/* Content with proper top margin */}
      <div className="max-w-[1600px] mx-auto px-6 py-8 pt-[180px]">
        {activeTab === "overview" ? (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Attendance Rate Card */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-purple-500/20 overflow-hidden relative group transition-all hover:shadow-xl hover:shadow-purple-500/30">
                {/* Glossy effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Rate</h3>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="text-4xl font-bold text-gray-900">{attendanceRate}%</div>
                  <div className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.5% from last month
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-sm"
                      style={{ width: `${attendanceRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-blue-500/20 overflow-hidden relative group transition-all hover:shadow-xl hover:shadow-blue-500/30">
                {/* Glossy effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-lg font-semibold text-gray-900">Avg. Working Hours</h3>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="text-4xl font-bold text-gray-900">{avgHours}h</div>
                  <div className="text-sm text-blue-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.2h from last month
                  </div>

                  {/* Visual representation */}
                  <div className="mt-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) => (
                      <div
                        key={hour}
                        className={`h-6 flex-1 rounded-sm shadow-sm ${hour <= Number(avgHours)
                            ? 'bg-gradient-to-t from-blue-500 to-blue-400'
                            : 'bg-gray-200'
                          }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* On-Time Rate Card */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-green-500/20 overflow-hidden relative group transition-all hover:shadow-xl hover:shadow-green-500/30">
                {/* Glossy effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-lg font-semibold text-gray-900">On-Time Rate</h3>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="text-4xl font-bold text-gray-900">87%</div>
                  <div className="text-sm text-green-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +1.8% from last month
                  </div>

                  {/* Circular progress */}
                  <div className="mt-4 relative h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"
                      style={{ width: '87%' }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Leave Balance Card */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-orange-500/20 overflow-hidden relative group transition-all hover:shadow-xl hover:shadow-orange-500/30">
                {/* Glossy effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-lg font-semibold text-gray-900">Leave Balance</h3>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="text-4xl font-bold text-gray-900">12 days</div>
                  <div className="text-sm text-orange-600 mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    2 days used this month
                  </div>

                  {/* Visual representation */}
                  <div className="mt-4 grid grid-cols-6 gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-6 bg-gradient-to-t from-orange-500 to-orange-400 rounded-sm shadow-sm"
                      ></div>
                    ))}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-6 bg-gray-200 rounded-sm shadow-sm"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2 rounded-xl border-gray-200/60 hover:bg-gray-50 shadow-sm">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-900">{attendanceData.length}</span> records
                </div>
              </div>

              <Button className="gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Attendance Records Table */}
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-lg shadow-purple-500/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none"></div>
              <div className="overflow-x-auto relative z-10">
                <table className="w-full">
                  <thead className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/60">
                    <tr>
                      <th className="w-12 px-4 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 shadow-sm"
                          checked={selectedRows.size === attendanceData.length}
                          onChange={toggleAllRows}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Clock-In</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Clock-Out</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Total Hours</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Notes</th>
                      <th className="w-12 px-4 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendanceData.map((record) => (
                      <tr
                        key={record.id}
                        className={`hover:bg-gray-50/80 transition-colors ${selectedRows.has(record.id) ? "bg-purple-50/80" : ""
                          }`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 shadow-sm"
                            checked={selectedRows.has(record.id)}
                            onChange={() => toggleRowSelection(record.id)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{record.date}</span>
                            <span className="text-xs text-gray-500">{record.dayOfWeek}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 font-medium">
                            {record.clockIn || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 font-medium">
                            {record.clockOut || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {record.totalHours ? (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900 font-medium">{record.totalHours}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(
                              record.status
                            )}`}
                          >
                            • {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{record.notes}</span>
                        </td>
                        <td className="px-4 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100 shadow-sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="shadow-lg shadow-gray-500/20">
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Report
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
