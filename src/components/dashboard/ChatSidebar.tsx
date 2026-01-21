"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Moon, Settings } from "lucide-react";
import { toast } from "sonner";
import NavigationIcons from "./chat/NavigationIcons";
import ChatSection from "./chat/ChatSection";
import { teamMessages } from "./chat/chatData";
import { useConversations } from "@/hooks/useConversations";
import { useChat } from "@/hooks/useChat";

interface ChatSidebarProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string, contentType?: string) => void;
  activeNavIcon?: string;
  onNavIconChange?: (icon: string) => void;
}

export default function ChatSidebar({ selectedChat, onSelectChat, activeNavIcon = "messages", onNavIconChange }: ChatSidebarProps) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [executiveStatus, setExecutiveStatus] = useState<Record<string, boolean>>({});

  // Fetch auth token
  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        // Try to get token from localStorage (similar to GroupInfo.tsx)
        let accessToken = null;

        // First try the standard key
        if (typeof window !== 'undefined') {
          accessToken = localStorage.getItem('access_token');

          // If not found, try alternative keys
          if (!accessToken) {
            const keys = Object.keys(localStorage);
            for (let key of keys) {
              if (key.toLowerCase().includes('access') && key.toLowerCase().includes('token')) {
                accessToken = localStorage.getItem(key);
                break;
              }
            }
          }
        }

        if (accessToken) {
          setAuthToken(accessToken);
        } else {
          console.error('No access token found in localStorage');
        }
      } catch (error) {
        console.error('Failed to fetch auth token:', error);
      }
    };

    fetchToken();
  }, []);

  const { conversations: staticConversations, loading: staticLoading, error: staticError } = useConversations(authToken);
  const { connected, conversations: chatConversations, loading: chatLoading, error: chatError } = useChat(authToken);

  // Always use chatConversations from useChat hook for real-time updates
  const activeConversations = chatConversations;
  const loading = chatLoading || staticLoading;
  const error = chatError || staticError;

  // Fetch executive status for all participants
  useEffect(() => {
    const fetchExecutiveStatus = async () => {
      // Get all unique participant IDs
      const participantIds = Array.from(
        new Set(
          activeConversations
            .flatMap(conv => [conv.participant_a, conv.participant_b])
            .filter(Boolean)
        )
      );

      // Fetch executive status for each participant
      for (const participantId of participantIds) {
        if (!executiveStatus.hasOwnProperty(participantId)) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/hq/executive/status/${participantId}`
            );

            if (response.ok) {
              const data = await response.json();
              setExecutiveStatus(prev => ({
                ...prev,
                [participantId]: data.data?.isExecutive || false
              }));
            }
          } catch (error) {
            console.error(`Failed to fetch executive status for ${participantId}:`, error);
          }
        }
      }
    };

    if (activeConversations.length > 0) {
      fetchExecutiveStatus();
    }
  }, [activeConversations]);

  // State for sidebar expansion (collapsible)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleNavIconClick = (icon: string) => {
    if (icon === 'messages' && activeNavIcon === 'messages') {
      setIsSidebarExpanded(!isSidebarExpanded);
    } else {
      if (icon === 'messages') setIsSidebarExpanded(true);
      onNavIconChange?.(icon);
    }
  };

  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchToIntranet = () => {
    setIsSwitching(true);
    // Show toast without navigation
    setTimeout(() => {
      toast("", {
        description: "Your account doesn't have the required permissions to access this intranet data. Contact your system administrator to request the appropriate access rights.",
        duration: 5000,
        style: {
          background: '#0a0a0a',
          border: '1px solid #1f1f1f',
          color: '#fff',
        },
        descriptionClassName: 'text-gray-400',
        classNames: {
          title: 'font-bold',
        },
      });
      setIsSwitching(false);
    }, 800);
  };

  const [searchQuery, setSearchQuery] = useState("");

  // Transform real conversations to match ChatItemData interface
  const directMessagesData = useMemo(() => {
    return activeConversations.map(conv => {
      // Determine if the other participant is an executive
      const otherParticipantId = conv.current_user_id
        ? (conv.participant_a === conv.current_user_id ? conv.participant_b : conv.participant_a)
        : conv.participant_b;

      const isExecutive = otherParticipantId ? (executiveStatus[otherParticipantId] || false) : false;

      return {
        id: conv.id,
        name: conv.participant_name || "Unknown User",
        avatar: conv.participant_avatar || "/profile/default.png",
        lastMessage: conv.last_message_content || "No messages yet",
        time: conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        unread: conv.unread_count || 0,
        isTyping: false,
        type: "direct" as const,
        status: "online" as const,
        contentType: "messages" as const,
        isExecutive // Add executive status
      };
    });
  }, [activeConversations, executiveStatus]);

  // Filter chats based on search
  const filteredTeamMessages = useMemo(() => {
    return teamMessages.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredDirectMessages = useMemo(() => {
    return directMessagesData.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [directMessagesData, searchQuery]);

  return (
    <div className={`h-full ${activeNavIcon === 'messages' && isSidebarExpanded ? 'w-full md:w-[350px]' : 'w-auto'} bg-[#070707] border-r border-white/5 shadow-[5px_0_30px_-5px_rgba(0,0,0,0.6)] flex flex-col relative z-20 transition-all duration-300`}>
      {/* Header Section */}
      <div className={`p-4 space-y-4 ${activeNavIcon === 'messages' && isSidebarExpanded ? 'block' : 'hidden'}`}>
        {/* Logo and Search Bar */}
        <div className="flex items-center w-full">
          {/* Logo */}
          <Image
            src="/logos/logo1.svg"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain flex-shrink-0"
          />

          {/* Search (pushes to right) */}
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#121212] border-none ring-1 ring-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] text-gray-300 placeholder:text-gray-500 h-9 rounded-full focus-visible:ring-1 focus-visible:ring-white/20 transition-all"
            />
          </div>
        </div>

      </div>

      {/* Main Content - Navigation Icons (Left) and Chat List (Right) */}
      <div className="flex flex-1 min-h-0 border-t border-[#1f1f1f]">
        {/* Navigation Icons - Left Side */}
        <div className="w-[56px] flex-shrink-0 border-r border-white/5 bg-[#070707] shadow-[2px_0_10px_rgba(0,0,0,0.2)] z-10">
          <NavigationIcons
            activeIcon={activeNavIcon}
            onIconClick={handleNavIconClick}
          />
        </div>

        {/* Chat List - Right Side */}
        <div className={`flex-1 flex flex-col overflow-hidden bg-transparent ${activeNavIcon === 'messages' && isSidebarExpanded ? 'flex' : 'hidden'}`}>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-4 space-y-6">
              {/* Team Messages Section */}
              <div className="flex-shrink-0">
                <ChatSection
                  title="Team messages"
                  count={teamMessages.length}
                  chats={filteredTeamMessages}
                  selectedChat={selectedChat}
                  onSelectChat={onSelectChat}
                />
              </div>

              {/* Direct Messages Section */}
              <div className="border-t border-[#1f1f1f] pt-6 flex-shrink-0">
                <ChatSection
                  title="Direct messages"
                  count={directMessagesData.length}
                  chats={filteredDirectMessages}
                  selectedChat={selectedChat}
                  onSelectChat={onSelectChat}
                  defaultCollapsed={true}
                  onStartNewChat={() => handleNavIconClick('directory')}
                />
              </div>
            </div>
          </div>

          {/* Switch Button - Fixed at bottom */}
          {/* <div className="">
            <div
              className="h-14 ml-4 mr-4 mb-4 rounded-full bg-gradient-to-b from-[#222] to-[#111] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] flex cursor-pointer items-center justify-center hover:translate-y-[-1px] hover:shadow-[0_6px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] active:translate-y-[1px] active:shadow-inner transition-all duration-300 group"
              onClick={handleSwitchToIntranet}
            >
              <div className="text-xs text-white">
                {isSwitching ? (
                  <span className="flex items-center gap-2">
                    <span className="iphone-spinner scale-75" style={{ color: '#fff' }} aria-label="Loading" role="status">
                      <div></div><div></div><div></div><div></div><div></div><div></div>
                      <div></div><div></div><div></div><div></div><div></div><div></div>
                    </span>
                    <span>Switching...</span>
                  </span>
                ) : (
                  <span className="px-0.5 py-0.5 bg-transparent font-semibold text-xs md:text-[14px]">Switch to Intranet</span>
                )}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}