"use client";

import { useState } from "react";
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
import {
  Users,
  Mail,
  Archive,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  Calendar,
  MessageCircle,
  Briefcase,
  Crown,
  UserCircle2,
  Phone,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
  joinedDate: string;
  experience: string;
  status: "Active" | "On Leave" | "Offline";
  avatar?: string;
  teams?: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: "#876363",
    name: "RIPUN BASUMATARY",
    position: "Manager",
    email: "ripun.basumatary@company.com",
    joinedDate: "01 Jan, 2024",
    experience: "1 year 9 months",
    status: "Active",
    teams: ["Engineering", "Product", "Operations"],
  },
  {
    id: "#876364",
    name: "VEESHAL D BODOSA",
    position: "Team Leader",
    email: "teamleader@company.com",
    joinedDate: "15 Jan, 2024",
    experience: "1 year 8 months",
    status: "Active",
    teams: ["Engineering", "Product"],
  },
  {
    id: "#876365",
    name: "ANANYA PANDEY",
    position: "Senior Developer",
    email: "debra.holt@gmail.com",
    joinedDate: "12 Sep, 2026",
    experience: "26 days",
    status: "On Leave",
    teams: ["Engineering"],
  },
  {
    id: "#876366",
    name: "RIDHIMA SINGH",
    position: "UI/UX Designer",
    email: "curtis.weaver@gmail.com",
    joinedDate: "13 Sep, 2026",
    experience: "25 days",
    status: "On Leave",
    teams: ["Design", "Product"],
  },
  {
    id: "#876367",
    name: "SHAGUN SINGH",
    position: "Product Manager",
    email: "deanna.curtis@gmail.com",
    joinedDate: "02 Sep, 2026",
    experience: "1 month 6 days",
    status: "Active",
    teams: ["Product"],
  },
  {
    id: "#876368",
    name: "JENNY BRAHMA",
    position: "QA Engineer",
    email: "tanya.hill@gmail.com",
    joinedDate: "16 Sep, 2026",
    experience: "22 days",
    status: "Offline",
    teams: ["Engineering", "QA"],
  },
  {
    id: "#876369",
    name: "ROBERT KUMAR",
    position: "Backend Developer",
    email: "curtis.weaver@gmail.com",
    joinedDate: "17 Sep, 2026",
    experience: "21 days",
    status: "Active",
    teams: ["Engineering"],
  },
  {
    id: "#876370",
    name: "JANESA D BRAHMA",
    position: "DevOps Engineer",
    email: "georgia.young@gmail.com",
    joinedDate: "03 Sep, 2026",
    experience: "1 month 5 days",
    status: "Active",
    teams: ["Engineering", "Operations"],
  },
];

export default function EmployeeSection() {
  const [activeTab, setActiveTab] = useState<"users" | "invitation" | "project-details">("users");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "On Leave":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "Offline":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  const toggleSelectMember = (id: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMembers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedMembers.size === teamMembers.length) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(teamMembers.map(e => e.id)));
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Team - OPERA MISSION</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {teamMembers.length} team members
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-10 px-4 border-gray-200 hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="h-10 px-4 bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/30">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-8 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${activeTab === "users"
              ? "border-teal-600 text-teal-700 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Users className="h-4 w-4" />
            <span className="text-sm">Team Members</span>
            <Badge
              variant="secondary"
              className={`rounded-full text-xs px-2 ${activeTab === "users"
                ? "bg-teal-100 text-teal-700"
                : "bg-gray-100 text-gray-600"
                }`}
            >
              {teamMembers.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("invitation")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${activeTab === "invitation"
              ? "border-teal-600 text-teal-700 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Mail className="h-4 w-4" />
            <span className="text-sm">Invitations</span>
            <Badge
              variant="secondary"
              className={`rounded-full text-xs px-2 ${activeTab === "invitation"
                ? "bg-teal-100 text-teal-700"
                : "bg-gray-100 text-gray-600"
                }`}
            >
              5
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("project-details")}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${activeTab === "project-details"
              ? "border-teal-600 text-teal-700 font-semibold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Archive className="h-4 w-4" />
            <span className="text-sm">Project Details</span>
            <Badge
              variant="secondary"
              className={`rounded-full text-xs px-2 ${activeTab === "project-details"
                ? "bg-teal-100 text-teal-700"
                : "bg-gray-100 text-gray-600"
                }`}
            >
              7
            </Badge>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white px-8 py-5">
        <div className="flex items-center gap-3 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 text-sm text-gray-600 border-gray-200 hover:bg-gray-50">
                All departments
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Engineering</DropdownMenuItem>
              <DropdownMenuItem>Design</DropdownMenuItem>
              <DropdownMenuItem>Product</DropdownMenuItem>
              <DropdownMenuItem>Operations</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 text-sm text-gray-600 border-gray-200 hover:bg-gray-50">
                All positions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Developer</DropdownMenuItem>
              <DropdownMenuItem>Designer</DropdownMenuItem>
              <DropdownMenuItem>Manager</DropdownMenuItem>
              <DropdownMenuItem>Engineer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 text-sm text-gray-600 border-gray-200 hover:bg-gray-50">
                All status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>On Leave</DropdownMenuItem>
              <DropdownMenuItem>Offline</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1" />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              className="pl-9 w-64 h-9 border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200  overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="grid grid-cols-[40px_100px_2fr_1.5fr_1fr_1fr_1fr_120px] gap-4 items-center">
            <input
              type="checkbox"
              checked={selectedMembers.size === teamMembers.length}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
            />
            <div className="text-xs font-medium text-gray-600">ID</div>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
              Name
              <ChevronDown className="h-3 w-3" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
              Position
              <ChevronDown className="h-3 w-3" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
              Joined
              <ChevronDown className="h-3 w-3" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
              Experience
              <ChevronDown className="h-3 w-3" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
              Status
              <ChevronDown className="h-3 w-3" />
            </div>
            <div className="text-xs font-medium text-gray-600 text-center">
              Actions
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {teamMembers.map((member, index) => (
            index === 0 ? (
              // Manager Row - Unique Design
              <div
                key={member.id}
                className="px-4 py-4 bg-black border-2 border-white/20"
              >
                <div className="grid grid-cols-[40px_100px_2fr_1.5fr_1fr_1fr_1fr_120px] gap-4 items-center">
                  <div className="flex items-center justify-center">
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white text-black text-xs px-2 py-0.5 font-bold">MANAGER</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-white">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-white text-black text-xs font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{member.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">{member.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white" />
                    <span className="text-sm text-white">{member.joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{member.experience}</span>
                  </div>
                  <div>
                    <Badge className="bg-white text-black font-semibold">
                      {member.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 px-3 text-xs font-medium bg-white hover:bg-gray-200 text-black"
                    >
                      <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                      Message
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-white hover:text-gray-300 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Team settings</DropdownMenuItem>
                        <DropdownMenuItem>Send email</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ) : index === 1 ? (
              // Team Leader Row - Highlighted Design
              <div
                key={member.id}
                className="px-4 py-4 bg-gradient-to-r from-teal-600 to-teal-700 border-2 border-teal-500/30"
              >
                <div className="grid grid-cols-[40px_100px_2fr_1.5fr_1fr_1fr_1fr_120px] gap-4 items-center">
                  <div className="flex items-center justify-center">
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white text-teal-700 text-xs px-2 py-0.5 font-bold">TEAM LEADER</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-white">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-white text-teal-700 text-xs font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{member.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">{member.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-white" />
                    <span className="text-sm text-white">{member.joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{member.experience}</span>
                  </div>
                  <div>
                    <Badge className="bg-white text-teal-700 font-semibold">
                      {member.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 px-3 text-xs font-medium bg-white hover:bg-gray-200 text-teal-700"
                    >
                      <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                      Message
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-white hover:text-gray-200 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Team settings</DropdownMenuItem>
                        <DropdownMenuItem>Send email</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ) : (
              // Regular Team Member Row
              <div
                key={member.id}
                className="px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-[40px_100px_2fr_1.5fr_1fr_1fr_1fr_120px] gap-4 items-center">
                  <input
                    type="checkbox"
                    checked={selectedMembers.has(member.id)}
                    onChange={() => toggleSelectMember(member.id)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                  />
                  <div className="text-sm font-bold text-black">{member.id}</div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-black text-white text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold text-gray-900">{member.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">{member.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{member.joinedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">{member.experience}</span>
                  </div>
                  <div>
                    <Badge variant="secondary" className={`${getStatusColor(member.status)} font-semibold`}>
                      {member.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs font-medium"
                    >
                      <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                      Message
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit details</DropdownMenuItem>
                        <DropdownMenuItem>Send email</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
