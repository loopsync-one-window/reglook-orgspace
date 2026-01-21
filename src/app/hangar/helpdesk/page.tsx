"use client";

import { useState } from "react";
import { Search, Plus, MessageCircle, Clock, AlertCircle, CheckCircle, User, Filter, MoreHorizontal, Paperclip, Send, Phone, Mail, FileText, Bug, Settings, Lightbulb, Zap, ArrowUp, ArrowDown, Minus, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: "Technical" | "HR" | "Facilities" | "Access" | "General";
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Pending" | "Resolved" | "Closed";
  assignee: string;
  assigneeAvatar?: string;
  reporter: string;
  reporterAvatar?: string;
  createdAt: string;
  updatedAt: string;
  responses: number;
  attachments: number;
}

// Mock tickets data
const mockTickets: Ticket[] = [
  {
    id: "HD-001",
    title: "VPN Connection Issues",
    description: "Unable to connect to company VPN from home office. Connection times out after authentication.",
    category: "Technical",
    priority: "High",
    status: "In Progress",
    assignee: "Veeshal D Bodosa",
    assigneeAvatar: "/avatars/veeshal.jpg",
    reporter: "Ripun Basumatary",
    reporterAvatar: "/avatars/ripun.jpg",
    createdAt: "2 hours ago",
    updatedAt: "30 minutes ago",
    responses: 3,
    attachments: 1,
  },
  {
    id: "HD-002",
    title: "New Employee Access Request",
    description: "Need system access setup for new hire starting Monday. Requires email, intranet, and development tools.",
    category: "Access",
    priority: "Medium",
    status: "Open",
    assignee: "Jenny Brahma",
    assigneeAvatar: "/avatars/jenny.jpg",
    reporter: "Ridhima Singh",
    reporterAvatar: "/avatars/ridhima.jpg",
    createdAt: "4 hours ago",
    updatedAt: "4 hours ago",
    responses: 1,
    attachments: 2,
  },
  {
    id: "HD-003",
    title: "Conference Room Booking System Bug",
    description: "Calendar integration not working properly. Double bookings occurring for Meeting Room B.",
    category: "Technical",
    priority: "Medium",
    status: "Pending",
    assignee: "Shagun Singh",
    assigneeAvatar: "/avatars/shagun.jpg",
    reporter: "Ananya Pandey",
    reporterAvatar: "/avatars/ananya.jpg",
    createdAt: "1 day ago",
    updatedAt: "6 hours ago",
    responses: 5,
    attachments: 0,
  },
  {
    id: "HD-004",
    title: "Laptop Hardware Replacement",
    description: "Keyboard keys not responding. Need hardware replacement for development work.",
    category: "Facilities",
    priority: "Low",
    status: "Resolved",
    assignee: "Facilities Team",
    reporter: "Ripun Basumatary",
    reporterAvatar: "/avatars/ripun.jpg",
    createdAt: "3 days ago",
    updatedAt: "1 day ago",
    responses: 2,
    attachments: 1,
  },
  {
    id: "HD-005",
    title: "Payroll Inquiry - Tax Deductions",
    description: "Question about tax deduction calculations on last month's payslip. Need clarification on components.",
    category: "HR",
    priority: "Low",
    status: "Closed",
    assignee: "Jenny Brahma",
    assigneeAvatar: "/avatars/jenny.jpg",
    reporter: "Veeshal D Bodosa",
    reporterAvatar: "/avatars/veeshal.jpg",
    createdAt: "1 week ago",
    updatedAt: "5 days ago",
    responses: 4,
    attachments: 3,
  },
];

// Quick action categories
const quickActions = [
  {
    title: "Technical Support",
    description: "Software, hardware, or system issues",
    icon: <Settings className="h-6 w-6" />,
    color: "bg-blue-500",
    category: "Technical",
  },
  {
    title: "IT Access Request",
    description: "System access, permissions, or accounts",
    icon: <User className="h-6 w-6" />,
    color: "bg-green-500",
    category: "Access",
  },
  {
    title: "HR Support",
    description: "Policies, benefits, or employee relations",
    icon: <MessageCircle className="h-6 w-6" />,
    color: "bg-purple-500",
    category: "HR",
  },
  {
    title: "Report a Bug",
    description: "Application bugs or system errors",
    icon: <Bug className="h-6 w-6" />,
    color: "bg-red-500",
    category: "Technical",
  },
];

export default function HelpdeskPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"tickets" | "create" | "knowledge">("tickets");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "Technical" as const,
    priority: "Medium" as const,
  });

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ticket.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === "All" || ticket.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: Ticket["status"]) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Resolved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "Critical":
        return "text-red-600";
      case "High":
        return "text-orange-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityIcon = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "Critical":
      case "High":
        return <ArrowUp className="h-4 w-4" />;
      case "Low":
        return <ArrowDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: Ticket["category"]) => {
    switch (category) {
      case "Technical":
        return <Settings className="h-4 w-4" />;
      case "HR":
        return <User className="h-4 w-4" />;
      case "Facilities":
        return <FileText className="h-4 w-4" />;
      case "Access":
        return <Zap className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const handleSubmitTicket = () => {
    // Handle ticket submission
    console.log("Submitting ticket:", newTicket);
    setNewTicket({ title: "", description: "", category: "Technical", priority: "Medium" });
    setActiveTab("tickets");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-900">IT Helpdesk</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tickets, issues, or solutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 h-10 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">+91 80000 12345</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">helpdesk@Intellaris.com</span>
                </div>
              </div>
              <Button 
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setActiveTab("create")}
              >
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8 mt-[100px]">
        
        {/* Quick Actions */}
        {activeTab === "tickets" && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/60 p-4 shadow-md shadow-gray-400/20 hover:shadow-lg hover:shadow-gray-400/30 transition-all cursor-pointer"
                  onClick={() => setActiveTab("create")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center text-white shadow-lg`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeTab === "tickets" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("tickets")}
                className="h-8 px-4"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                My Tickets
              </Button>
              <Button
                variant={activeTab === "create" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("create")}
                className="h-8 px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
              <Button
                variant={activeTab === "knowledge" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("knowledge")}
                className="h-8 px-4"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Knowledge Base
              </Button>
            </div>

            {activeTab === "tickets" && (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Category
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedCategory("All")}>All Categories</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("Technical")}>Technical</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("HR")}>HR</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("Facilities")}>Facilities</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedCategory("Access")}>Access</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedStatus("All")}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Open")}>Open</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("In Progress")}>In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Pending")}>Pending</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatus("Resolved")}>Resolved</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      Priority
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedPriority("All")}>All Priorities</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPriority("Critical")}>Critical</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPriority("High")}>High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPriority("Medium")}>Medium</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedPriority("Low")}>Low</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/60 p-6 shadow-md shadow-gray-400/20 hover:shadow-lg hover:shadow-gray-400/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {ticket.id}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{ticket.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(ticket.category)}
                        <span>{ticket.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Created {ticket.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{ticket.responses} responses</span>
                      </div>
                      {ticket.attachments > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="h-4 w-4" />
                          <span>{ticket.attachments} files</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <div className={`flex items-center gap-1 ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityIcon(ticket.priority)}
                          <span className="text-sm font-medium">{ticket.priority}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={ticket.assigneeAvatar} />
                          <AvatarFallback className="text-xs">
                            {ticket.assignee.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">{ticket.assignee}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Add Comment</DropdownMenuItem>
                        <DropdownMenuItem>Close Ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "create" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-8 shadow-lg shadow-gray-400/20">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Support Ticket</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    className="h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value as any})}
                      className="w-full h-11 rounded-lg border border-gray-200 px-3 bg-white focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Technical">Technical Support</option>
                      <option value="HR">HR Support</option>
                      <option value="Facilities">Facilities</option>
                      <option value="Access">Access Request</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                      className="w-full h-11 rounded-lg border border-gray-200 px-3 bg-white focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Textarea
                    placeholder="Provide detailed information about your issue, including steps to reproduce, error messages, and any relevant context..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    className="h-32 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Drop files here or click to browse</p>
                    <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    onClick={handleSubmitTicket}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11"
                    disabled={!newTicket.title || !newTicket.description}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("tickets")}
                    className="px-6 h-11"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/60 p-6 shadow-md shadow-gray-400/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">VPN Setup Guide</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Step-by-step instructions for configuring VPN access on different devices.</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Guide
                </Button>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/60 p-6 shadow-md shadow-gray-400/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <KeyRound className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Password Reset</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">How to reset your password and update security settings.</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Guide
                </Button>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/60 p-6 shadow-md shadow-gray-400/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Email Configuration</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Configure your email client for company email access.</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Guide
                </Button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}