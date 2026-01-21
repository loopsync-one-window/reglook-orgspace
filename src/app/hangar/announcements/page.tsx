"use client";

import { useState } from "react";
import { Search, Plus, ChevronDown, ThumbsUp, MessageCircle, Calendar, Star, ExternalLink, Filter, Users, Building, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Announcement {
  id: string;
  title: string;
  description: string;
  department: string;
  category: "Policy" | "Event" | "System" | "HR" | "General";
  priority: "High" | "Medium" | "Low";
  status: "New" | "Under Review" | "Planned" | "In Progress" | "Needs Attention" | "Published";
  author: string;
  date: string;
  votes: number;
  comments: number;
  tags: string[];
}

// Mock announcements data
const mockAnnouncements: Announcement[] = [
  {
    id: "ANN001",
    title: "New Remote Work Policy Effective January 2026",
    description: "Updated guidelines for hybrid and remote work arrangements. All employees must review and acknowledge the new policy by December 31st.",
    department: "Human Resources",
    category: "Policy",
    priority: "High",
    status: "Under Review",
    author: "Jenny Brahma",
    date: "Dec 15, 2024",
    votes: 12,
    comments: 8,
    tags: ["Policy", "Remote Work", "HR"],
  },
  {
    id: "ANN002",
    title: "Annual Company Retreat - Registration Open",
    description: "Join us for our annual company retreat in Goa! Team building activities, workshops, and celebration dinner included.",
    department: "Human Resources",
    category: "Event",
    priority: "Medium",
    status: "Planned",
    author: "Ridhima Singh",
    date: "Dec 12, 2024",
    votes: 24,
    comments: 15,
    tags: ["Event", "Team Building", "Registration"],
  },
  {
    id: "ANN003",
    title: "System Maintenance Window - Weekend Dec 21-22",
    description: "Scheduled maintenance for all internal systems. Email and intranet services may be temporarily unavailable.",
    department: "Engineering",
    category: "System",
    priority: "High",
    status: "In Progress",
    author: "Veeshal D Bodosa",
    date: "Dec 10, 2024",
    votes: 6,
    comments: 3,
    tags: ["Maintenance", "System", "Downtime"],
  },
  {
    id: "ANN004",
    title: "Q4 Performance Reviews - Manager Training",
    description: "Mandatory training session for all team leads and managers on the new performance review process and guidelines.",
    department: "Human Resources",
    category: "HR",
    priority: "Medium",
    status: "Needs Attention",
    author: "Jenny Brahma",
    date: "Dec 8, 2024",
    votes: 3,
    comments: 7,
    tags: ["Training", "Performance", "Managers"],
  },
  {
    id: "ANN005",
    title: "New Employee Parking Allocation System",
    description: "Introduction of digital parking slot booking system for all office locations. QR code access and real-time availability.",
    department: "Facilities",
    category: "General",
    priority: "Low",
    status: "Published",
    author: "Shagun Singh",
    date: "Dec 5, 2024",
    votes: 8,
    comments: 12,
    tags: ["Parking", "Facilities", "Digital"],
  },
  {
    id: "ANN006",
    title: "Holiday Schedule 2026 - Important Dates",
    description: "Complete list of company holidays and important dates for the upcoming year. Plan your leaves accordingly.",
    department: "Human Resources",
    category: "General",
    priority: "Medium",
    status: "Published",
    author: "Jenny Brahma",
    date: "Nov 28, 2024",
    votes: 18,
    comments: 5,
    tags: ["Holidays", "Calendar", "Planning"],
  },
];

// Status statistics
const statusStats = [
  { label: "New", count: 3, color: "bg-blue-500" },
  { label: "Under Review", count: 8, color: "bg-purple-500" },
  { label: "Planned", count: 12, color: "bg-gray-700" },
  { label: "In Progress", count: 6, color: "bg-yellow-500" },
  { label: "Needs Attention", count: 4, color: "bg-orange-500" },
  { label: "Published", count: 15, color: "bg-green-500" },
];

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");

  const filteredAnnouncements = mockAnnouncements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || announcement.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || announcement.status === selectedStatus;
    const matchesPriority = selectedPriority === "All" || announcement.priority === selectedPriority;
    const matchesDepartment = selectedDepartment === "All" || announcement.department === selectedDepartment;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      "New": "bg-blue-100 text-blue-700 border-blue-200",
      "Under Review": "bg-purple-100 text-purple-700 border-purple-200",
      "Planned": "bg-gray-100 text-gray-700 border-gray-200",
      "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Needs Attention": "bg-orange-100 text-orange-700 border-orange-200",
      "Published": "bg-green-100 text-green-700 border-green-200",
    };
    return statusMap[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap: { [key: string]: string } = {
      "High": "text-red-600",
      "Medium": "text-yellow-600",
      "Low": "text-green-600",
    };
    return priorityMap[priority] || "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Company Announcements</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 h-10 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content with proper top margin */}
      <div className="max-w-[1600px] mx-auto px-6 py-8 mt-[100px]">

        {/* Status Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statusStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-full h-1 ${stat.color} rounded-full mb-3`}></div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.count}</div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Create Button */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Announcements</h2>
                <Badge variant="secondary" className="rounded-full">
                  {filteredAnnouncements.length} results
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                {/* Filters */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Building className="h-4 w-4" />
                        Department
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedDepartment("All")}>All Departments</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedDepartment("Human Resources")}>Human Resources</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedDepartment("Engineering")}>Engineering</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedDepartment("Facilities")}>Facilities</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Status
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedStatus("All")}>All Status</DropdownMenuItem>
                      {statusStats.map((status) => (
                        <DropdownMenuItem key={status.label} onClick={() => setSelectedStatus(status.label)}>
                          {status.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Category
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedCategory("All")}>All Categories</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCategory("Policy")}>Policy</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCategory("Event")}>Event</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCategory("System")}>System</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCategory("HR")}>HR</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedCategory("General")}>General</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Priority
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setSelectedPriority("All")}>All Priorities</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPriority("High")}>High</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPriority("Medium")}>Medium</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedPriority("Low")}>Low</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all relative"
            >
              {/* Priority indicator */}
              <div className={`absolute left-0 top-0 w-1 h-full rounded-l-xl ${announcement.priority === "High" ? "bg-red-500" :
                  announcement.priority === "Medium" ? "bg-yellow-500" : "bg-green-500"
                }`}></div>

              <div className="ml-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{announcement.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Engagement stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{announcement.votes} Votes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{announcement.comments} Comments</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      {announcement.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Status badge */}
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(announcement.status)} font-medium border`}
                    >
                      {announcement.status}
                    </Badge>
                  </div>
                </div>

                {/* Author and department */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>by {announcement.author}</span>
                      <span>•</span>
                      <span>{announcement.department}</span>
                    </div>
                    <div className={`font-medium ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority} Priority
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
              Create First Announcement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}