import React, { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import ChatItem from "./ChatItem";

interface ChatItemData {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isTyping?: boolean;
  type?: "team" | "direct";
  status?: "online" | "offline";
  contentType?: "messages" | "meetings" | "notifications";
  verified?: boolean;
  isExecutive?: boolean; // Add executive property
}

interface ChatSectionProps {
  title: string;
  count: number;
  chats: ChatItemData[];
  selectedChat: string | null;
  onSelectChat: (chatId: string, contentType?: string) => void;
  defaultCollapsed?: boolean;
  onStartNewChat?: () => void;
}

export default function ChatSection({
  title,
  count,
  chats,
  selectedChat,
  onSelectChat,
  defaultCollapsed = false,
  onStartNewChat
}: ChatSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const isTeamMessages = title === "Team messages";

  const handleCreateTeam = () => {
    // This would typically trigger a modal or navigate to a team creation page
    console.log("Create team button clicked");
    // For now, we'll just log it. In a real implementation, you might:
    // - Open a modal to create a team
    // - Navigate to a team creation page
    // - Dispatch a Redux action
  };

  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 font-semibold text-xs text-gray-500 uppercase tracking-wide mb-3 hover:text-gray-400 transition-colors w-full"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
          {title} <span className="text-gray-600">({count})</span>
        </button>

        {isTeamMessages && (
          <div className="relative group">
            <button
              onClick={handleCreateTeam}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/5 cursor-not-allowed transition-colors mb-3 opacity-50"
              disabled
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="absolute top-0 right-full transform -translate-y-0.2 mr-2 hidden group-hover:block bg-red-600 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Disabled
              </div>
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-red-600"></div>
            </div>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="space-y-1">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                {...chat}
                isSelected={selectedChat === chat.id}
                onClick={(contentType) => onSelectChat(chat.id, contentType)}
                contentType={chat.contentType}
              />
            ))
          ) : isTeamMessages ? (
            <div className="text-left text-gray-500 text-xs py-2 px-3">
              You don't have permission to create a team. Please wait to be assigned.
            </div>
          ) : (
            <div className="text-center text-gray-500 text-xs py-3 px-3 mx-1 bg-white/5 rounded-lg flex flex-col items-center gap-2">
              <span className="mt-5 font-semibold text-white">No new messages</span>
              {onStartNewChat && (
                <button
                  onClick={onStartNewChat}
                  className="bg-white mt-5 mb-5 hover:bg-white/80 text-black  text-sm px-6 py-2 rounded-full transition-colors font-semibold cursor-pointer"
                >
                  Start a new chat
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}