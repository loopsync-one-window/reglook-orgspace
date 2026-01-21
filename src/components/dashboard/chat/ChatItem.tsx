import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ChatItemProps {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isTyping?: boolean;
  type?: "team" | "direct";
  status?: "online" | "offline";
  isSelected: boolean;
  onClick: (contentType?: string) => void;
  contentType?: string;
  verified?: boolean;
  isExecutive?: boolean; // Add executive property
}

export default function ChatItem({
  id,
  name,
  avatar,
  lastMessage,
  time,
  unread,
  isTyping,
  type,
  status,
  isSelected,
  onClick,
  contentType = "messages",
  verified,
  isExecutive // Destructure executive property
}: ChatItemProps) {
  return (
    <button
      onClick={() => onClick(contentType)}
      className={`w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gradient-to-r hover:from-white/10 hover:to-transparent transition-all cursor-pointer border border-transparent hover:border-white/5 ${isSelected ? "bg-gradient-to-r from-white/15 to-transparent border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" : ""
        }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {type === "team" ? (
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-semibold">
            {name.charAt(0)}
          </div>
        ) : (
          <Avatar className="w-10 h-10 font-semibold">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-white/5 text-white text-xs">
              {name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Status Indicator */}
        {((type === "team" && id === "design-studio") || (type === "direct" && status === "online")) && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111111]"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-200 truncate">
              {name}
            </span>
            {verified && (
              <img
                src="/special/white-badge.svg"
                alt="Verified"
                className="w-3.5 h-3.5 ml-1"
              />
            )}
            {isExecutive && (
              <img
                src="/special/white-badge.svg"
                alt="Executive"
                className="w-3.5 h-3.5 ml-1 relative top-0.5"
              />
            )}
          </div>
          {/* <span className="text-xs text-gray-600 flex-shrink-0 ml-2">{time}</span> */}
        </div>
        <div className="flex items-center gap-1.5">
          {isTyping && (
            <span className="text-xs text-green-500">is typing...</span>
          )}
          <span className="text-xs text-gray-500 truncate">
            {lastMessage}
          </span>
        </div>
      </div>

      {/* Unread Badge - Only show when count > 0 and chat is not selected */}
      {unread && unread > 0 && !isSelected && (
        <Badge className="bg-green-700 hover:bg-green-700 text-white font-semibold text-xs h-5 min-w-5 rounded-full px-1.5 flex-shrink-0">
          {unread}
        </Badge>
      )}
    </button>
  );
}