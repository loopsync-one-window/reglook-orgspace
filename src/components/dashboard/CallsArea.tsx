"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Calendar,
  Clock,
  Plus,
  Link,
  Settings,
  Monitor,
  Camera,
  Volume2,
  MoreVertical,
  Copy,
  Share,
  Edit,
  Trash2,
  Info
} from "lucide-react";
import MeetingRoom from "./MeetingRoom";

interface Meeting {
  id: string;
  title: string;
  host: string;
  time: string;
  date: string;
  duration: string;
  participants: number;
  status: 'upcoming' | 'live' | 'ended';
  meetingId: string;
  isRecurring?: boolean;
}

interface CallsAreaProps {
  isGroupInfoCollapsed?: boolean;
}

export default function CallsArea({ isGroupInfoCollapsed = false }: CallsAreaProps) {
  const [meetingId, setMeetingId] = useState("");
  const [activeTab, setActiveTab] = useState<'home' | 'meetings' | 'recordings'>('home');
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [showMeetingRoom, setShowMeetingRoom] = useState(false);

  // Add state to track if the component is inactive
  const [isInactive] = useState(true);
  const [inactiveUntil] = useState("November 25, 2026");

  const handleButtonClick = (buttonId: string, action: () => void) => {
    // If inactive, don't perform any actions
    if (isInactive) return;

    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      action();
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  const handleStartMeeting = () => {
    setShowMeetingRoom(true);
  };

  const handleCloseMeeting = () => {
    setShowMeetingRoom(false);
  };

  const renderSpinner = () => (
    <span className="iphone-spinner scale-75" style={{ color: '#fff' }} aria-label="Loading" role="status">
      <div></div><div></div><div></div><div></div><div></div><div></div>
      <div></div><div></div><div></div><div></div><div></div><div></div>
    </span>
  );

  const upcomingMeetings: Meeting[] = [
    {
      id: "1",
      title: "Design Review Meeting",
      host: "Sarah Johnson",
      time: "2:30 PM",
      date: "Today",
      duration: "1 hour",
      participants: 8,
      status: "upcoming",
      meetingId: "123-456-789",
      isRecurring: false
    },
    {
      id: "2",
      title: "Weekly Team Standup",
      host: "David Miller",
      time: "10:00 AM",
      date: "Tomorrow",
      duration: "30 min",
      participants: 12,
      status: "upcoming",
      meetingId: "987-654-321",
      isRecurring: true
    },
    {
      id: "3",
      title: "Client Presentation",
      host: "Alex Thompson",
      time: "3:00 PM",
      date: "Oct 10",
      duration: "2 hours",
      participants: 5,
      status: "upcoming",
      meetingId: "456-789-123"
    }
  ];

  return (
    <>
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 transition-all duration-500 ease-in-out">
          <div className="flex h-full flex-col bg-black">
            {/* Header */}
            <div className="p-4 bg-black border-b border-[#1f1f1f] flex items-center justify-between px-4 md:px-6"
              style={{
                boxShadow: "0 4px 12px rgba(255, 255, 255, 0.05)"
              }}>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-white" style={{
                  textShadow: "0 0 8px rgba(255, 255, 255, 0.3)"
                }}>Meetings</h2>
                {isInactive && (
                  <span className="flex items-center mt-1 text-xs bg-red-900/30 text-red-500 px-2 py-1 rounded">
                    <Info className="w-4 h-4 mr-1" />
                    Inactive
                  </span>

                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 rounded-full text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300 transition-all duration-300 cursor-not-allowed opacity-50"
                  style={{
                    boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
                  }}
                  disabled={isInactive}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className={`p-4 md:p-6 space-y-6 ${isGroupInfoCollapsed ? 'max-w-6xl' : 'max-w-4xl'} mx-auto`}>

                {/* Join Meeting Section */}
                <div className="bg-[#0a0a0a] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Join a Meeting</h3>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 w-full">
                      <Input
                        placeholder="Enter Meeting ID"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        className="bg-transparent rounded-full border-[#2a2a2a] text-gray-300 placeholder:text-gray-600 text-xs h-12 text-center font-mono tracking-wider w-full"
                        disabled={isInactive}
                      />
                    </div>
                    <Button
                      className="h-12 px-4 md:px-8 cursor-pointer rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium w-full md:w-auto"
                      disabled={!meetingId.trim() || loadingStates['join-meeting'] || isInactive}
                      onClick={() => handleButtonClick('join-meeting', () => console.log('Joining meeting:', meetingId))}
                    >
                      {loadingStates['join-meeting'] ? (
                        renderSpinner()
                      ) : (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          Join a Meeting
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* New Meeting */}
                  <div className="bg-[#0a0a0a] rounded-xl p-6 transition-colors group">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center transition-colors">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">New Meeting</h4>
                        <p className="text-sm text-gray-400 mb-4">Start an instant meeting</p>
                        <Button
                          className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white"
                          disabled={loadingStates['new-meeting'] || isInactive}
                          onClick={() => handleButtonClick('new-meeting', handleStartMeeting)}
                        >
                          {loadingStates['new-meeting'] ? (
                            renderSpinner()
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Start Meeting
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Meeting */}
                  <div className="bg-[#0a0a0a] rounded-xl p-6 transition-colors group">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center transition-colors">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">Schedule</h4>
                        <p className="text-sm text-gray-400 mb-4">Plan a future meeting</p>
                        <Button
                          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white"
                          disabled={loadingStates['schedule-meeting'] || isInactive}
                          onClick={() => handleButtonClick('schedule-meeting', () => console.log('Scheduling meeting'))}
                        >
                          {loadingStates['schedule-meeting'] ? (
                            renderSpinner()
                          ) : (
                            <>
                              <Calendar className="w-4 h-4 mr-2" />
                              Schedule Meeting
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Share Screen */}
                  <div className="bg-[#0a0a0a] rounded-xl p-6 transition-colors group">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center transition-colors">
                        <Monitor className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100 mb-2">Share Screen</h4>
                        <p className="text-sm text-gray-400 mb-4">Share your screen only</p>
                        <Button
                          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white"
                          disabled={loadingStates['share-screen'] || isInactive}
                          onClick={() => handleButtonClick('share-screen', () => console.log('Starting screen share'))}
                        >
                          {loadingStates['share-screen'] ? (
                            renderSpinner()
                          ) : (
                            <>
                              <Monitor className="w-4 h-4 mr-2" />
                              Share Screen
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Meetings */}
                <div className="bg-[#0a0a0a] rounded-xl p-6 ">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-100">Upcoming Meetings</h3>
                    <Badge variant="secondary" className="bg-transparent text-white border-[#2a2a2a]">
                      {/* {upcomingMeetings.length} */}
                      0
                    </Badge>
                  </div>

                  {/* No Upcoming Meetings Message */}
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-400">No upcoming meetings</p>
                  </div>
                </div>

                {/* Personal Meeting Room */}
                <div className="bg-[#0a0a0a] rounded-xl p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="w-full md:w-auto">
                      <h3 className="text-lg font-semibold text-gray-100 mb-2">Personal Meeting Room</h3>
                      <p className="text-sm text-gray-400 mb-3 text-wrap">Your personal meeting space that's always available</p>
                      <div className="flex items-center gap-2 text-sm text-blue-400 flex-wrap">
                        <Link className="w-4 h-4 flex-shrink-0" />
                        <span className="font-mono break-all">orgspace/personal/:roomId</span>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 p-1 cursor-not-allowed opacity-50 flex-shrink-0" disabled={isInactive}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white"
                      disabled={loadingStates['start-room'] || isInactive}
                      onClick={() => handleButtonClick('start-room', handleStartMeeting)}
                    >
                      {loadingStates['start-room'] ? (
                        renderSpinner()
                      ) : (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          Start Room
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Room Modal */}
      <MeetingRoom
        isOpen={showMeetingRoom}
        onClose={handleCloseMeeting}
        meetingTitle="Project Reporting"
        meetingHost="Ripun's Meeting Room"
      />
    </>
  );
}
