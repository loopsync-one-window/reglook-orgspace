"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Bell,
  Settings,
  Check,
  X,
  MoreVertical,
  Clock
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  avatar?: string;
  read: boolean;
  type: 'message' | 'mention' | 'system' | 'update';
}

export default function NotificationsArea() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'mentions'>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "System Update",
      description: "New features have been added to the platform",
      time: "6 hours ago",
      read: false,
      type: 'system'
    },
    {
      id: "2",
      title: "Platform Update",
      description: "Security patches have been applied every week",
      time: "7 days ago",
      read: true,
      type: 'update'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'mentions') return notification.type === 'mention';
    return true;
  });

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
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
              }}>Notifications</h2>
              {unreadCount > 0 && (
                <Badge className="bg-blue-600 text-white">{unreadCount}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-full text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300 transition-all duration-300"
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
                }}
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#1f1f1f] bg-black">
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${activeTab === 'all'
                ? 'border-blue-600 text-white'
                : 'border-transparent text-gray-500 hover:text-black hover:bg-white'
                }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${activeTab === 'unread'
                ? 'border-blue-600 text-white'
                : 'border-transparent text-gray-500 hover:text-black hover:bg-white'
                }`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-blue-600 text-white">{unreadCount}</Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${activeTab === 'mentions'
                ? 'border-blue-600 text-white'
                : 'border-transparent text-gray-500 hover:text-black hover:bg-white'
                }`}
              onClick={() => setActiveTab('mentions')}
            >
              Mentions
            </Button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Bell className="w-12 h-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">No notifications</h3>
                <p className="text-sm text-gray-500">
                  {activeTab === 'all'
                    ? "You don't have any notifications yet"
                    : activeTab === 'unread'
                      ? "You've read all your notifications"
                      : "You don't have any mentions"}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg transition-colors ${notification.read ? 'bg-[#0a0a0a]' : 'bg-[#111111]'
                      } hover:bg-[#1a1a1a]`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar or Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback className="bg-[#2a2a2a] text-gray-400">
                              {notification.title.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'system' ? 'bg-blue-600/20' :
                            notification.type === 'update' ? 'bg-green-600/20' : 'bg-gray-600/20'
                            }`}>
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className={`font-medium ${notification.read ? 'text-gray-400' : 'text-white'}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7 rounded-full text-gray-500 hover:bg-[#2a2a2a] hover:text-blue-400"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 rounded-full text-gray-500 hover:bg-[#2a2a2a] hover:text-red-400"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}