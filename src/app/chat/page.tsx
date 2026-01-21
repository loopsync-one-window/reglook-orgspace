"use client";

import React, { useState, useEffect } from "react";
import ChatSidebar from "@/components/dashboard/ChatSidebar";
import MessageArea from "@/components/dashboard/MessageArea";
import RealMessageArea from "@/components/dashboard/RealMessageArea";
import CallsArea from "@/components/dashboard/CallsArea";
import GroupInfo from "@/components/dashboard/GroupInfo";
import DisclaimerModal from "@/components/ui/DisclaimerModal";
import CommunityArea from "@/components/dashboard/chat/CommunityArea";
import NotificationsArea from "@/components/dashboard/chat/NotificationsArea";
import OrganisationDirectory from "@/components/dashboard/chat/OrganisationDirectory";

export default function ChatsPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [isGroupInfoCollapsed, setIsGroupInfoCollapsed] = useState(true);
  const [activeNavIcon, setActiveNavIcon] = useState("messages");
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if privacy notice has been accepted
    const hasAccepted = localStorage.getItem('privacy_notice_accepted');
    if (!hasAccepted) {
      setShowDisclaimer(true);
    }
  }, []);

  // Handle chat selection with content type
  const handleChatSelect = (chatId: string, contentType?: string) => {
    setSelectedChat(chatId);
    if (contentType) {
      switch (contentType) {
        case "messages":
          setActiveNavIcon("messages");
          break;
        case "meetings":
          setActiveNavIcon("phone");
          break;
        case "notifications":
          setActiveNavIcon("notifications");
          break;
        default:
          setActiveNavIcon("messages");
      }
    }
  };

  // Fetch auth token
  useEffect(() => {
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

  // Determine if the selected chat is a direct message (real chat) or team message (mock)
  const isDirectMessage = selectedChat && selectedChat !== 'Corporate Desk' && selectedChat !== 'design-studio' && selectedChat !== 'marketing';

  return (
    <>
      <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
        <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col h-full md:w-auto z-20 ${activeNavIcon !== 'messages' ? 'w-auto' : 'w-full'} md:static bg-[#0a0a0a]`}>
          <ChatSidebar
            selectedChat={selectedChat}
            onSelectChat={handleChatSelect}
            activeNavIcon={activeNavIcon}
            onNavIconChange={setActiveNavIcon}
          />
        </div>

        <div className={`flex-1 flex overflow-hidden ${(!selectedChat && activeNavIcon === 'messages') ? 'hidden md:flex' : 'flex'} relative z-10`}>
          {activeNavIcon === "phone" ? (
            <CallsArea isGroupInfoCollapsed={isGroupInfoCollapsed} />
          ) : activeNavIcon === "users" ? (
            <div className="flex-1 flex overflow-hidden">
              <CommunityArea />
            </div>
          ) : activeNavIcon === "notifications" ? (
            <div className="flex-1 flex overflow-hidden">
              <NotificationsArea />
            </div>
          ) : activeNavIcon === "directory" ? (
            <OrganisationDirectory onDirectMessage={(userId) => {
              // Set the selected chat to the user ID to open a direct message
              setSelectedChat(userId);
              // Switch to messages view
              setActiveNavIcon("messages");
            }} />
          ) : isDirectMessage ? (
            // Use real message area for direct messages
            <RealMessageArea
              isGroupInfoCollapsed={isGroupInfoCollapsed}
              selectedChat={selectedChat}
              onCloseChat={() => setSelectedChat(null)}
              token={authToken}
            />
          ) : (
            // Use mock message area for team messages
            <MessageArea
              isGroupInfoCollapsed={isGroupInfoCollapsed}
              selectedChat={selectedChat}
              onCloseChat={() => setSelectedChat(null)}
            />
          )}
        </div>

        {activeNavIcon !== "users" && activeNavIcon !== "notifications" && activeNavIcon !== "demo" && (
          <div className="hidden lg:block h-full border-l border-[#1f1f1f]">
            <GroupInfo
              isCollapsed={isGroupInfoCollapsed}
              onToggleCollapse={() => setIsGroupInfoCollapsed(!isGroupInfoCollapsed)}
            />
          </div>
        )}
      </div>

      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => {
          localStorage.setItem('privacy_notice_accepted', 'true');
          setShowDisclaimer(false);
        }}
      />
    </>
  );
}