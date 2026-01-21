"use client";

import { useState } from "react";
import { Search, Upload, Filter, List, Grid, MoreHorizontal, Users, Building, Mail, Phone, MapPin, Calendar, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  lastActive: string;
  avatar?: string;
  status: "Active" | "On Leave" | "Remote" | "Offline";
  skills: string[];
  teamCount: number;
}

// Mock employee data
const mockEmployeeData: Employee[] = [
  {
    id: "EMP001",
    name: "Ripun Basumatary",
    position: "Senior Software Engineer",
    department: "Engineering",
    email: "ripun.basumatary@Intellaris.com",
    phone: "+91 98765 43210",
    location: "Guwahati, AS",
    joinDate: "Jan 15, 2023",
    lastActive: "2 minutes ago",
    status: "Active",
    skills: ["React", "Node.js", "TypeScript"],
    teamCount: 8,
  },
  {
    id: "EMP002",
    name: "Veeshal D Bodosa",
    position: "Team Lead",
    department: "Engineering",
    email: "veeshal.bodosa@Intellaris.com",
    phone: "+91 87654 32109",
    location: "Mumbai, MH",
    joinDate: "Mar 20, 2022",
    lastActive: "5 minutes ago",
    status: "Active",
    skills: ["Leadership", "Python", "DevOps"],
    teamCount: 12,
  },
  {
    id: "EMP003",
    name: "Ananya Pandey",
    position: "UI/UX Designer",
    department: "Design",
    email: "ananya.pandey@Intellaris.com",
    phone: "+91 76543 21098",
    location: "Bangalore, KA",
    joinDate: "Sep 12, 2023",
    lastActive: "1 hour ago",
    status: "On Leave",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    teamCount: 5,
  },
  {
    id: "EMP004",
    name: "Ridhima Singh",
    position: "Product Manager",
    department: "Product",
    email: "ridhima.singh@Intellaris.com",
    phone: "+91 65432 10987",
    location: "Delhi, DL",
    joinDate: "Jun 08, 2023",
    lastActive: "30 minutes ago",
    status: "Remote",
    skills: ["Strategy", "Analytics", "Agile"],
    teamCount: 15,
  },
  {
    id: "EMP005",
    name: "Shagun Singh",
    position: "QA Engineer",
    department: "Engineering",
    email: "shagun.singh@Intellaris.com",
    phone: "+91 54321 09876",
    location: "Pune, MH",
    joinDate: "Feb 14, 2024",
    lastActive: "2 days ago",
    status: "Offline",
    skills: ["Testing", "Automation", "Selenium"],
    teamCount: 6,
  },
  {
    id: "EMP006",
    name: "Jenny Brahma",
    position: "HR Manager",
    department: "Human Resources",
    email: "jenny.brahma@Intellaris.com",
    phone: "+91 43210 98765",
    location: "Kolkata, WB",
    joinDate: "Nov 30, 2021",
    lastActive: "15 minutes ago",
    status: "Active",
    skills: ["Recruitment", "Policy", "Training"],
    teamCount: 4,
  },
];

// Department stats for quick access
// Removed - no longer needed

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());

  const filteredEmployees = mockEmployeeData.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalEmployees = mockEmployeeData.length;
  const activeEmployees = mockEmployeeData.filter(emp => emp.status === "Active").length;

  const getStatusColor = (status: Employee["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "On Leave":
        return "bg-yellow-100 text-yellow-700";
      case "Remote":
        return "bg-blue-100 text-blue-700";
      case "Offline":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const toggleEmployeeSelection = (id: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEmployees(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map(emp => emp.id)));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search and Title */}
            <div className="flex items-center gap-6 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for employees, roles, departments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-1 mr-10 p-1 bg-gray-100 rounded-lg">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content with proper top margin */}
      <div className="max-w-[1600px] mx-auto px-6 py-8 mt-[100px]">
        {/* All Employees */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-500/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">All Employees</h3>
                <Badge variant="secondary" className="rounded-full">
                  {filteredEmployees.length} results
                </Badge>
              </div>
              <Button variant="outline" className="gap-2 rounded-lg border-gray-200 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Employee List */}
          <div className="relative z-10">
            {viewMode === "list" ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/60">
                    <tr>
                      <th className="w-12 px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.size === filteredEmployees.length}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 shadow-sm"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Position</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Department</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Last Active</th>
                      <th className="w-12 px-4 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        className={`hover:bg-gray-50/80 transition-colors ${
                          selectedEmployees.has(employee.id) ? "bg-purple-50/80" : ""
                        }`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedEmployees.has(employee.id)}
                            onChange={() => toggleEmployeeSelection(employee.id)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 shadow-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 shadow-sm">
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{employee.position}</div>
                          <div className="text-sm text-gray-500">{employee.teamCount} team members</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{employee.department}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{employee.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="secondary"
                            className={`${getStatusColor(employee.status)} shadow-sm`}
                          >
                            {employee.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{employee.lastActive}</span>
                          </div>
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
                                <Users className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Meeting
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-white rounded-xl border border-gray-200/60 p-4 shadow-md shadow-gray-400/20 hover:shadow-lg hover:shadow-gray-400/30 transition-all relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <Avatar className="h-12 w-12 shadow-sm">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Badge
                          variant="secondary"
                          className={`${getStatusColor(employee.status)} shadow-sm text-xs`}
                        >
                          {employee.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{employee.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{employee.position}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Building className="h-4 w-4" />
                        {employee.department}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <MapPin className="h-4 w-4" />
                        {employee.location}
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{employee.teamCount} team members</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-gray-100">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}