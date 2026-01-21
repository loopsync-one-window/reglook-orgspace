"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Menu, Settings, User, Calendar as CalendarIcon, Clock, MapPin, Phone, Users, Video, Coffee, Briefcase, BookOpen, Star, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendee: string;
  attendeeAvatar?: string;
  type: "meeting" | "consultation" | "training" | "personal" | "system";
  color: string;
  location?: string;
  description?: string;
}

interface TimeSlot {
  time: string;
  hour: number;
}

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    time: "7:30 - 8:00",
    duration: "30 min",
    attendee: "Engineering Team",
    type: "meeting",
    color: "bg-orange-100 border-orange-200 text-orange-800",
    location: "Conference Room A",
  },
  {
    id: "2",
    title: "Client Consultation",
    time: "8:00 - 8:30",
    duration: "30 min",
    attendee: "Ripun Basumatary",
    attendeeAvatar: "/avatars/ripun.jpg",
    type: "consultation",
    color: "bg-teal-100 border-teal-200 text-teal-800",
    location: "Virtual Meeting",
  },
  {
    id: "3",
    title: "Product Planning",
    time: "9:00 - 9:30",
    duration: "30 min",
    attendee: "Ridhima Singh",
    attendeeAvatar: "/avatars/ridhima.jpg",
    type: "meeting",
    color: "bg-purple-100 border-purple-200 text-purple-800",
    location: "Meeting Room B",
  },
  {
    id: "4",
    title: "HR Interview",
    time: "10:10 - 10:45",
    duration: "35 min",
    attendee: "Jenny Brahma",
    attendeeAvatar: "/avatars/jenny.jpg",
    type: "consultation",
    color: "bg-teal-100 border-teal-200 text-teal-800",
    location: "HR Office",
  },
  {
    id: "5",
    title: "System Maintenance",
    time: "10:00 - 10:30",
    duration: "30 min",
    attendee: "Veeshal D Bodosa",
    attendeeAvatar: "/avatars/veeshal.jpg",
    type: "system",
    color: "bg-teal-100 border-teal-200 text-teal-800",
    location: "Server Room",
  },
  {
    id: "6",
    title: "Design Review",
    time: "11:00 - 11:45",
    duration: "45 min",
    attendee: "Ananya Pandey",
    attendeeAvatar: "/avatars/ananya.jpg",
    type: "meeting",
    color: "bg-red-100 border-red-200 text-red-800",
    location: "Design Studio",
  },
];

// Time slots for the calendar
const timeSlots: TimeSlot[] = [
  { time: "8:00 am", hour: 8 },
  { time: "8:30 am", hour: 8.5 },
  { time: "9:00 am", hour: 9 },
  { time: "9:30 am", hour: 9.5 },
  { time: "10:00 am", hour: 10 },
  { time: "10:30 am", hour: 10.5 },
  { time: "11:00 am", hour: 11 },
  { time: "11:30 am", hour: 11.5 },
  { time: "12:00 pm", hour: 12 },
  { time: "12:30 pm", hour: 12.5 },
];

// Team members (columns)
const teamMembers = [
  {
    name: "Ripun Basumatary",
    role: "Senior Engineer",
    avatar: "/avatars/ripun.jpg",
    status: "available",
  },
  {
    name: "Ridhima Singh",
    role: "Product Manager",
    avatar: "/avatars/ridhima.jpg",
    status: "busy",
  },
  {
    name: "Jenny Brahma",
    role: "HR Manager",
    avatar: "/avatars/jenny.jpg",
    status: "available",
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState("28 December");
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />;
      case "consultation":
        return <Video className="h-4 w-4" />;
      case "training":
        return <BookOpen className="h-4 w-4" />;
      case "personal":
        return <Coffee className="h-4 w-4" />;
      case "system":
        return <Settings className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "busy":
        return "bg-red-100 text-red-800 border-red-200";
      case "away":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 shadow-lg z-40">
        <div className="flex flex-col items-center py-6 space-y-6">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="space-y-4">
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-teal-100 text-teal-600">
              <CalendarIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-20 min-h-screen">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{selectedDate}</h1>
                  <Button variant="ghost" className="text-sm text-gray-500 h-auto p-0 font-normal">
                    Today
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "day" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("day")}
                    className="h-8 px-4"
                  >
                    Day
                  </Button>
                  <Button
                    variant={viewMode === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("week")}
                    className="h-8 px-4"
                  >
                    Week
                  </Button>
                </div>

                <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
                  Manage
                </Button>

                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/user.jpg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Team Headers */}
            <div className="grid grid-cols-4 border-b border-gray-100">
              <div className="p-4 border-r border-gray-100">
                {/* Time column header */}
              </div>
              {teamMembers.map((member) => (
                <div key={member.name} className="p-4 border-r border-gray-100 last:border-r-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{member.name}</h3>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(member.status)}`}>
                      {member.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="relative">
              {timeSlots.map((slot, index) => (
                <div key={slot.time} className="grid grid-cols-4 border-b border-gray-50 last:border-b-0 min-h-[80px]">
                  {/* Time Column */}
                  <div className="p-4 border-r border-gray-100 bg-gray-50/50">
                    <div className="text-sm font-medium text-gray-600">{slot.time}</div>
                  </div>

                  {/* Event Columns */}
                  {teamMembers.map((member, memberIndex) => (
                    <div key={member.name} className="p-3 border-r border-gray-100 last:border-r-0 relative">
                      {/* Render events for this time slot and member */}
                      {mockEvents
                        .filter(event => 
                          event.time.includes(slot.time.split(' ')[0]) &&
                          (memberIndex === 0 && event.attendee.includes("Ripun") ||
                           memberIndex === 1 && event.attendee.includes("Ridhima") ||
                           memberIndex === 2 && event.attendee.includes("Jenny") ||
                           event.attendee.includes("Team"))
                        )
                        .map((event) => (
                          <div
                            key={event.id}
                            className={`${event.color} rounded-lg p-3 mb-2 border shadow-sm hover:shadow-md transition-all cursor-pointer`}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-shrink-0 mt-0.5">
                                {getEventIcon(event.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{event.title}</h4>
                                <p className="text-xs opacity-75 mt-1">{event.time}</p>
                                {event.location && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3 opacity-60" />
                                    <span className="text-xs opacity-75">{event.location}</span>
                                  </div>
                                )}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-60 hover:opacity-100">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Add Button */}
        <Button
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-xl hover:shadow-2xl transition-all"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Event Details Sidebar */}
      {selectedEvent && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedEvent(null)}
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 text-xl mb-2">{selectedEvent.title}</h3>
                <Badge variant="outline" className={selectedEvent.color}>
                  {selectedEvent.type}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{selectedEvent.time}</p>
                    <p className="text-sm text-gray-500">28 December 2024</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedEvent.attendeeAvatar} />
                      <AvatarFallback className="text-xs">
                        {selectedEvent.attendee.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{selectedEvent.attendee}</span>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 space-y-3">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  Join Meeting
                </Button>
                <Button variant="outline" className="w-full">
                  Reschedule
                </Button>
              </div>

              {/* Additional Details */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-3">Additional Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium">{selectedEvent.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium capitalize">{selectedEvent.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}