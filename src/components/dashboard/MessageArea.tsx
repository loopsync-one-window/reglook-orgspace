"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone,
  Video,
  Info,
  Send,
  Smile,
  Paperclip,
  Mic,
  MessageCircle,
  X,
  ArrowBigDown,
  CircleArrowOutUpRight,
  Reply
} from "lucide-react";
import Image from "next/image";
import MediaViewerModal from "@/components/ui/MediaViewerModal";
import NoChatSelected from "./NoChatSelected";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  reactions?: { emoji: string; count: number }[];
  images?: string[];
  files?: { url: string; name: string; type: 'pdf' | 'doc' | 'other' }[];
  isYou?: boolean;
}

interface MessageAreaProps {
  isGroupInfoCollapsed?: boolean;
  selectedChat?: string | null;
  onCloseChat?: () => void;
}

export default function MessageArea({ isGroupInfoCollapsed = false, selectedChat, onCloseChat }: MessageAreaProps) {
  const [message, setMessage] = useState("");
  const [mediaViewer, setMediaViewer] = useState<{
    isOpen: boolean;
    url: string;
    type: 'image' | 'pdf';
    fileName?: string;
  }>({
    isOpen: false,
    url: '',
    type: 'image'
  });

  const openMediaViewer = (url: string, type: 'image' | 'pdf', fileName?: string) => {
    setMediaViewer({
      isOpen: true,
      url,
      type,
      fileName
    });
  };

  const closeMediaViewer = () => {
    setMediaViewer(prev => ({ ...prev, isOpen: false }));
  };

  const messages: Message[] = [
    {
      id: "1",
      sender: "Ripun Basumatary",
      avatar: "/profile/ripun.jpg",
      content: "Good morning, team! Hope you're all having a productive week. Let's make this a great one together! 🌟",
      time: "11:30 PM | 8 Aug, 2026",
      reactions: [
        { emoji: "❤️", count: 18 },
        { emoji: "🔥", count: 8 }
      ]
    },
    {
      id: "2",
      sender: "Jenny",
      avatar: "/profil/ripun.jpg",
      content: "Hello everyone! 😊 Just wanted to check in and see how the team is doing today.\n\nI'm excited to share that the design mockups will be ready for your review by tomorrow evening. Looking forward to your feedback!",
      time: "11:40 PM | 8 Aug, 2026",
      images: [
        "/images/bg-image.png",
        "/images/bg-image.png",
        "/images/bg-image.png"
      ],
      reactions: [
        { emoji: "❤️", count: 10 },
        { emoji: "👍", count: 4 },
        { emoji: "🔥", count: 2 }
      ]
    },
    {
      id: "3",
      sender: "You",
      avatar: "/prfile/ripun.jpg",
      content: "Great preview, team! I really appreciate the attention to detail and the thoughtful use of color palette and contrast. This is exactly the direction we should be heading in.",
      time: "12:40 PM | 8 Aug, 2026",
      isYou: true
    },
    {
      id: "4",
      sender: "You",
      avatar: "/prfile/ripun.jpg",
      content: "Outstanding work, everyone! This is exactly what we were aiming for. Let's keep up this momentum!",
      time: "12:41 PM | 8 Aug, 2026",
      isYou: true,
      reactions: [
        { emoji: "👍", count: 8 }
      ]
    },
    {
      id: "5",
      sender: "David",
      avatar: "/profle/ripun.jpg",
      content: "We're all set and ready to move forward with the next phase. Great collaboration, everyone!",
      time: "Just now"
    },
    {
      id: "6",
      sender: "Sarah",
      avatar: "/profile/ripun.jpg",
      content: "Hi team, I've prepared the project documents for your review. Please find them attached below.\n\nLet me know if you have any questions or need any clarifications.",
      time: "Just now",
      files: [
        { url: "/documents/project-brief.pdf", name: "Project Brief.pdf", type: "pdf" },
        { url: "/documents/requirements.pdf", name: "Requirements.pdf", type: "pdf" }
      ]
    }
  ];

  // Show no-chat-selected component if no chat is selected
  if (!selectedChat) {
    return (
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <NoChatSelected />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <div key={selectedChat} className="absolute inset-0">
        <div className="flex h-full flex-col">
          {/* Chat Header */}
          <div className="p-4 bg-black border-b border-[#1f1f1f] flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-100">
                {selectedChat === 'design-studio' ? 'Design Studio Team' :
                  selectedChat === 'marketing' ? 'Marketing Team' :
                    selectedChat || 'Chat'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300"
                onClick={onCloseChat}
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300">
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300">
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-black scrollbar-hide px-4 md:px-6 py-4">
            <div className={`space-y-6 ${isGroupInfoCollapsed ? 'max-w-6xl' : 'max-w-4xl'} min-h-full pt-4`}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isYou ? "justify-end" : ""}`}
                >
                  {!msg.isYou && (
                    <Avatar className="w-9 h-9 border border-[#2a2a2a] mt-1 flex-shrink-0">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback className="bg-[#2a2a2a] text-xs">
                        {msg.sender.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`flex-1 ${msg.isYou ? "flex flex-col items-end" : ""}`}>
                    {!msg.isYou && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-300">
                          {msg.sender}
                        </span>
                        {msg.sender === "Ripun Basumatary" && (
                          <div className="relative group">
                            <Image
                              src="/special/executive.svg"
                              alt="Verified"
                              width={16}
                              height={16}
                              className="mt-1"
                            />
                          </div>
                        )}
                        <span className="text-xs text-gray-600">{msg.time}</span>
                      </div>
                    )}

                    <div className={`inline-block ${msg.isYou ? "max-w-lg" : "max-w-2xl"}`}>
                      <div
                        className={`px-4 py-2.5 shadow-lg ${msg.isYou
                          ? "text-white bg-transparent shadow-white/10"
                          : "text-white shadow-black/30"
                          }`}
                      >
                        <div className="flex items-start">
                          {!msg.isYou && (
                            <Reply className="inline rotate-180 mr-2 h-4 w-4 text-white/80 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          </div>
                          {msg.isYou && (
                            <Reply className="inline ml-2 h-4 w-4 text-white/80 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>

                      {msg.images && msg.images.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2" style={{ paddingLeft: '1.5rem' }}>
                          {msg.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="aspect-[3/4] rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden shadow-lg shadow-black/30 cursor-pointer hover:border-[#3a3a3a] transition-colors"
                              onClick={() => openMediaViewer(img, 'image', `Design ${idx + 1}`)}
                            >
                              <img
                                src={img}
                                alt={`Design ${idx + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.files && msg.files.length > 0 && (
                        <div className="mt-2 space-y-2" style={{ paddingLeft: '1.5rem' }}>
                          {msg.files.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] cursor-pointer transition-colors"
                              onClick={() => openMediaViewer(file.url, file.type === 'pdf' ? 'pdf' : 'image', file.name)}
                            >
                              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-red-400 text-xs font-bold">
                                  {file.type.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-300 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Click to view
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex items-center gap-1 mt-2" style={{ paddingLeft: '1.5rem' }}>
                          {msg.reactions.map((reaction, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-xs shadow-sm hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-gray-400">{reaction.count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.isYou && (
                      <span className="text-xs text-gray-600 mt-1">{msg.time}</span>
                    )}
                  </div>

                  {msg.isYou && (
                    <Avatar className="w-9 h-9 border border-[#2a2a2a] mt-1 flex-shrink-0">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback className="text-xs text-white font-bold shadow-inner" style={{ background: 'repeating-linear-gradient(45deg, #000 0px, #000 4px, #fff 4px, #fff 8px)' }}>
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-[#0a0a0a] border-t border-[#1f1f1f]">
            <div className={`flex items-center gap-3 ${isGroupInfoCollapsed ? 'max-w-6xl' : 'max-w-4xl'} mx-auto`}>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300 flex-shrink-0">
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your Message"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 placeholder:text-gray-600 h-11 rounded-xl pr-10 focus-visible:ring-1 focus-visible:ring-[#4a9eff]"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-500 hover:bg-[#2a2a2a] hover:text-gray-300"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300 flex-shrink-0">
                <Mic className="w-4 h-4" />
              </Button>
              <Button className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff5757] to-[#ff6b6b] cursor-pointer hover:bg-[#e55a2b] text-white shadow-lg shadow-[#ff6b35]/30 flex-shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <MediaViewerModal
            isOpen={mediaViewer.isOpen}
            onClose={closeMediaViewer}
            mediaUrl={mediaViewer.url}
            mediaType={mediaViewer.type}
            fileName={mediaViewer.fileName}
          />
        </div>
      </div>
    </div>
  );
}
