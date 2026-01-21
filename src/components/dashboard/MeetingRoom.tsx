"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  X, 
  Check, 
  ChevronLeft,
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  Phone,
  Settings,
  Users,
  MessageCircle,
  Smile,
  Send,
  Edit3,
  Circle,
  Square,
  MoreHorizontal,
  Volume2,
  VolumeX,
  ChevronRight,
  Share,
  ScreenShare,
  ScreenShareIcon,
  UserPlus,
  ChevronDown,
  Copy,
  Link
} from "lucide-react";

interface MeetingRoomProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle?: string;
  meetingHost?: string;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isHost?: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
}

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  avatar: string;
  requestTime: string;
  department?: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function MeetingRoom({ isOpen, onClose, meetingTitle = "Project Reporting", meetingHost = "George's Meeting Room" }: MeetingRoomProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'agenda' | 'chat' | 'chat'>('agenda');
  const [chatMessage, setChatMessage] = useState("");
  const [showJoinRequest, setShowJoinRequest] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showInviteDropdown, setShowInviteDropdown] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [participants] = useState<Participant[]>([
    { id: "1", name: "Alicia Padlock", avatar: "/profile/ripun.jpg", isMuted: true, isVideoOff: false },
    { id: "2", name: "Sri Veronica", avatar: "/profle/ripun.jpg", isMuted: false, isVideoOff: false },
    { id: "3", name: "Corbyn Stefan", avatar: "/profle/ripun.jpg", isMuted: true, isVideoOff: false },
  ]);
  
  const [chatMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "Alicia Padlock", message: "How about our problem last week?", time: "2:02 PM" },
    { id: "2", sender: "You", message: "It's all clear, no worries 😊", time: "2:03 PM" },
    { id: "3", sender: "Sri Veronica", message: "Yes, it's been solved. Since we have daily meeting to discuss everything 😊", time: "2:10 PM" }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Team Discussion", completed: true },
    { id: "2", title: "Daily Work Review at 1:00 PM", completed: false },
    { id: "3", title: "Weekly Report Stand Up Meeting", completed: false }
  ]);

  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([
    { 
      id: "1", 
      name: "Sarah Johnson", 
      email: "sarah.johnson@company.com", 
      avatar: "/profile/sarah.jpg", 
      requestTime: "2:15 PM",
      department: "Marketing"
    },
    { 
      id: "2", 
      name: "Michael Chen", 
      email: "michael.chen@company.com", 
      avatar: "/profile/michael.jpg", 
      requestTime: "2:12 PM",
      department: "Engineering"
    },
    { 
      id: "3", 
      name: "Emily Davis", 
      email: "emily.davis@company.com", 
      avatar: "/profile/emily.jpg", 
      requestTime: "2:08 PM",
      department: "Design"
    }
  ]);

  // Recording timer effect
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !linkCopied) {
        setShowInviteDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [linkCopied]);

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleJoinRequest = (requestId: string, action: 'approve' | 'deny') => {
    setJoinRequests(joinRequests.filter(request => request.id !== requestId));
    // Here you would typically also handle the actual approval/denial logic
  };

  const meetingLink = `https://meet.company.com/room/${meetingTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from closing
    try {
      await navigator.clipboard.writeText(meetingLink);
      setLinkCopied(true);
      // Show copy feedback animation, then close dropdown
      setTimeout(() => {
        setLinkCopied(false);
        setShowInviteDropdown(false); // Close dropdown after animation
      }, 3000); // 3 seconds to see the animation
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.log('Clipboard not available');
    }
  };

  const handleDropdownToggle = () => {
    if (!showInviteDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
    setShowInviteDropdown(!showInviteDropdown);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Main Meeting Interface */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-md transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">{meetingTitle}</h1>
              <p className="text-sm text-white/70">{meetingHost}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            <Button 
              variant="ghost" 
              onClick={() => setShowParticipants(true)}
              className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-200"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Participants</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => setShowJoinRequest(true)}
              className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Join Request</span>
              <div className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {joinRequests.length}
              </div>
            </Button>
            
            <div className="relative" ref={dropdownRef}>
              <Button 
                ref={buttonRef}
                variant="ghost" 
                onClick={handleDropdownToggle}
                className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-200"
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm font-medium">Invite to Room</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showInviteDropdown ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-6 p-6">
          {/* Video Area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Main Video */}
            <div className="relative flex-1 bg-transparent rounded-3xl overflow-hidden border border-white/10">
              {/* Mock video feed */}
              <div className="absolute inset-0 bg-transparent">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <span className="text-4xl font-bold text-white">R</span>
                  </div>
                </div>
              </div>
              
              {/* User indicator */}
              <div className="absolute top-6 left-6 flex items-center bg-black/60 backdrop-blur-xl rounded-full border border-white/20 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <span className="text-sm font-bold text-white">R</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                  <span className="text-sm font-semibold text-white">Ripun</span>
                  <Image 
                    src="/special/executive.svg" 
                    alt="Verified" 
                    width={16} 
                    height={16} 
                    className="opacity-80"
                  />
                  <span className="text-sm text-white/50">(You)</span>
                </div>
              </div>


              {/* Meeting Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-full border transition-all duration-200 ${
                    isMuted 
                      ? 'bg-red-500/80 cursor-pointer hover:bg-red-500 hover:text-white border-red-400/30 text-white' 
                      : 'bg-white/10 cursor-pointer hover:bg-white/20 hover:text-white border-white/20 text-white'
                  } backdrop-blur-md`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`w-12 h-12 rounded-full border transition-all duration-200 ${
                    isVideoOff 
                      ? 'bg-red-500/80 hover:bg-red-500 cursor-pointer hover:text-white border-red-400/30 text-white' 
                      : 'bg-white/10 hover:bg-white/20 cursor-pointer hover:text-white border-white/20 text-white'
                  } backdrop-blur-md`}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-full hover:text-white cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all duration-200"
                >
                  <ScreenShare className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="w-12 h-12 rounded-full hover:text-white cursor-pointer bg-red-500/80 hover:bg-red-500 border border-red-400/30 text-white backdrop-blur-md transition-all duration-200"
                >
                  <Phone className="w-5 h-5 rotate-[135deg]" />
                </Button>
              </div>

              {/* Audio visualizer */}
              <div className="absolute bottom-6 right-6 flex items-center gap-3">
                <div className="flex items-end gap-0.5 bg-black/60 backdrop-blur-xl rounded-lg px-3 py-2  shadow-lg h-8">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-0.5 rounded-full animate-pulse ${
                        i % 2 === 0 ? 'bg-white/80' : 'bg-gray-400/70'
                      }`}
                      style={{
                        height: `${Math.random() * 12 + 4}px`,
                        animationDelay: `${i * 150}ms`,
                        animationDuration: '1s'
                      }}
                    />
                  ))}
                </div>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-black/60 hover:bg-white/10 cursor-pointer hover:text-white text-white backdrop-blur-xl border border-white/20 transition-all duration-200 hover:border-white/30">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Participant Videos */}
            <div className="flex gap-3">
              {participants.map((participant) => (
                <div key={participant.id} className="relative w-48 h-32 bg-transparent rounded-2xl overflow-hidden border border-white/10">
                  {/* Mock video feed */}
                  <div className="absolute inset-0 bg-transparent">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Avatar className="w-12 h-12 border-2 border-white/30">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-transparent text-white">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  {/* Participant name */}
                  <div className="absolute bottom-1 left-2 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center justify-center">
                    <span className="text-[12px] font-medium text-white text-center">{participant.name}</span>
                  </div>

                  {/* Mute indicator */}
                  {participant.isMuted && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center border border-red-400/30">
                      <MicOff className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* More participants */}
              <Button className="w-48 h-32 bg-[#0a0a0a] hover:bg-[#2a2a2a] border border-white/10 rounded-2xl flex items-center justify-center text-white transition-all duration-200">
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-[#0a0a0a] rounded-3xl flex flex-col relative">
            {/* Tab Navigation */}
            <div className="flex p-4 gap-2">
              <Button
                variant="ghost"
                onClick={() => setActiveTab('agenda')}
                className={`flex-1 h-12 rounded-none font-semibold transition-all duration-300 border-b-2 ${
                  activeTab === 'agenda' 
                    ? 'text-white border-b-white' 
                    : 'text-white/70 hover:text-black border-b-transparent hover:border-b-white/50'
                }`}
              >
                Agenda
              </Button>
              <Button
                variant="ghost"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 h-12 rounded-none font-semibold transition-all duration-300 border-b-2 ${
                  activeTab === 'chat' 
                    ? 'text-white border-b-white' 
                    : 'text-white/70 hover:text-black border-b-transparent hover:border-b-white/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  Chat
                  <div className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    4
                  </div>
                </div>
              </Button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex flex-col px-4 pb-20">
              {activeTab === 'agenda' && (
                <div className="space-y-4">
                  <div className="bg-transparent rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">Agenda</h3>
                      <Button variant="ghost" size="icon" className="w-6 h-6 text-white/60 hover:text-black cursor-pointer">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      During the meeting, we covered some topics and reported that we achieved several targets set during the previous meeting. In today...
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 space-y-4 overflow-y-auto">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-white">{msg.sender}</span>
                              {msg.sender === 'Sri Veronica' && (
                                <Image 
                                  src="/special/executive.svg" 
                                  alt="Verified" 
                                  width={12} 
                                  height={12} 
                                  className="ml-0.5"
                                />
                              )}
                            </div>
                            <span className="text-xs text-white/50">{msg.time}</span>
                          </div>
                          <p className="text-sm text-white leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}            </div>
            
            {/* Fixed Chat Input at Bottom */}
            {activeTab === 'chat' && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0a0a] to-transparent border-t border-white/10 p-4 rounded-b-3xl">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 h-12 rounded-2xl pr-12 focus-visible:ring-1 focus-visible:ring-white/20"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 text-white/60 hover:text-white">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Fixed Positioned Dropdown - Isolated from parent stacking context */}
      {showInviteDropdown && (
        <div 
          className="fixed w-80 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-[200]"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Link className="w-5 h-5 text-white/70" />
              <h3 className="text-lg font-semibold text-white">Meeting Link</h3>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
              <p className="text-sm text-white/70 mb-2">Share this link to invite others:</p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ${linkCopied 
                    ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {linkCopied ? (
                    <div className="flex items-center animate-bounce">
                      <Check className="w-4 h-4 mr-2" />
                      <span>Copied!</span>
                    </div>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Anyone with this link can join</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowInviteDropdown(false)}
                className="w-6 h-6 text-white/50 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Join Requests Modal */}
      {showJoinRequest && (
        <div className="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-black/90 w-full h-full p-8 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <MessageCircle className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Join Requests ({joinRequests.length})</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowJoinRequest(false)}
                className="w-10 h-10 text-white hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Join Requests List */}
            <div className="flex-1 overflow-y-auto">
              {joinRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-16 h-16 text-white/30 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Join Requests</h3>
                  <p className="text-white/60">When people request to join this meeting, they'll appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinRequests.map((request) => (
                    <div key={request.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <Avatar className="w-20 h-20 border-2 border-white/30">
                          <AvatarImage src={request.avatar} />
                          <AvatarFallback className="bg-transparent text-white text-2xl font-bold">
                            {request.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{request.name}</h3>
                      <p className="text-sm text-white/70 mb-2">{request.email}</p>
                      {request.department && (
                        <Badge variant="outline" className="border-white/20 text-white/70 text-xs mb-2">
                          {request.department}
                        </Badge>
                      )}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-white/50">Requested at {request.requestTime}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 w-full">
                        <Button 
                          onClick={() => handleJoinRequest(request.id, 'deny')}
                          variant="outline" 
                          className="flex-1 bg-transparent hover:bg-red-500/20 border-red-400/30 text-red-400 hover:text-red-300 hover:border-red-400/50 px-3 py-2 text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Deny
                        </Button>
                        <Button 
                          onClick={() => handleJoinRequest(request.id, 'approve')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setJoinRequests([])}
                  variant="outline" 
                  className="bg-transparent hover:text-white border-white/20 text-white hover:bg-white/10 px-6 py-2"
                  disabled={joinRequests.length === 0}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Requests
                </Button>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">
                  {joinRequests.length === 0 
                    ? "No pending requests" 
                    : `${joinRequests.length} pending request${joinRequests.length > 1 ? 's' : ''}`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipants && (
        <div className="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-black/90 w-full h-full p-8 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Participants ({participants.length + 1})</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowParticipants(false)}
                className="w-10 h-10 text-white hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Participants List */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Current User */}
                <div className="bg-white/5 p-6 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-20 h-20 border-2 border-white/30">
                      <AvatarFallback className="bg-transparent text-white text-2xl font-bold">
                        R
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">You (Host)</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-transparent font-semibold text-white border-white/20">
                      Host
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {isMuted ? (
                        <MicOff className="w-4 h-4 text-red-400" />
                      ) : (
                        <Mic className="w-4 h-4 text-green-400" />
                      )}
                      <span className="text-sm text-white/70">
                        {isMuted ? 'Muted' : 'Unmuted'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isVideoOff ? (
                        <VideoOff className="w-4 h-4 text-red-400" />
                      ) : (
                        <Video className="w-4 h-4 text-green-400" />
                      )}
                      <span className="text-sm text-white/70">
                        {isVideoOff ? 'Video Off' : 'Video On'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Other Participants */}
                {participants.map((participant) => (
                  <div key={participant.id} className="bg-white/5 p-6 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 border-2 border-white/30">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-transparent text-white text-2xl font-bold">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{participant.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      {participant.isHost && (
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-400/30">
                          Host
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        Participant
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {participant.isMuted ? (
                          <MicOff className="w-4 h-4 text-red-400" />
                        ) : (
                          <Mic className="w-4 h-4 text-green-400" />
                        )}
                        <span className="text-sm text-white/70">
                          {participant.isMuted ? 'Muted' : 'Unmuted'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {participant.isVideoOff ? (
                          <VideoOff className="w-4 h-4 text-red-400" />
                        ) : (
                          <Video className="w-4 h-4 text-green-400" />
                        )}
                        <span className="text-sm text-white/70">
                          {participant.isVideoOff ? 'Video Off' : 'Video On'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite People
                </Button>
                <Button variant="outline" className=" bg-transparent hover:text-white border-white/20 text-white hover:bg-white/10 px-6 py-2">
                  <Share className="w-4 h-4 mr-2" />
                  Share Meeting Link
                </Button>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Users className="w-4 h-4" />
                <span className="text-sm">{participants.length + 1} people in this meeting</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}