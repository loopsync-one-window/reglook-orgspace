import React from "react";
import { MessageCircle, Phone, Users, Bell, FolderSearch, Code, ChartScatter, MessageCircleIcon, PanelsTopLeftIcon, FolderCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationIconsProps {
  activeIcon: string;
  onIconClick: (icon: string) => void;
}

export default function NavigationIcons({ activeIcon, onIconClick }: NavigationIconsProps) {
  const icons = [
    { id: "messages", icon: MessageCircleIcon, label: "Messages" },
    { id: "users", icon: Users, label: "Community" },
    { id: "directory", icon: FolderCheck, label: "Directory" },
    { id: "phone", icon: Phone, label: "Calls" },
    { id: "notifications", icon: Bell, label: "Notifications" },
  ];

  return (
    <div className="flex flex-col items-center py-4 space-y-2">
      {icons.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant="ghost"
          size="icon"
          className={`rounded-full p-2 cursor-pointer hover:bg-white/5 hover:text-white transition-all duration-300 ${activeIcon === id ? "bg-white/5 text-white" : "text-gray-500"
            }`}
          onClick={() => onIconClick(id)}
          title={label}
        >
          <Icon className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
}