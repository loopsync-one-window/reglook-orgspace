export interface ChatItemData {
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
}

export const teamMessages: ChatItemData[] = [
  // Empty array as per requirement
];

export const directMessages: ChatItemData[] = [
  {
    id: "ripun",
    name: "Ripun",
    avatar: "/profile/ripun.jpg",
    lastMessage: "Any update?",
    time: "11:17",
    isTyping: false,
    unread: 1,
    type: "direct",
    status: "online",
    contentType: "messages"
  },
  {
    id: "manager",
    name: "Jenny",
    avatar: "/logos/ripun.jpg",
    lastMessage: "",
    time: "11:17",
    isTyping: true,
    unread: 15,
    type: "direct",
    status: "online",
    contentType: "messages"
  },
];