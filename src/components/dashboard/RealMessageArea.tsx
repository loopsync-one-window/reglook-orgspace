"use client";

import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Reply,
  RefreshCw,
  InfoIcon,
  MapPin,
  Building,
  Mail,
  File,
  Image as ImageIcon,
  Upload,
  Download
} from "lucide-react";
import MediaViewerModal from "@/components/ui/MediaViewerModal";
import NoChatSelected from "./NoChatSelected";
import { useChat } from "@/hooks/useChat";

interface Employee {
  id: string;
  full_name: string;
  job_title: string;
  department: string;
  work_email: string;
  employee_id: string;
  location?: string;
  profile_image_url?: string;
}

interface RealMessageAreaProps {
  isGroupInfoCollapsed?: boolean;
  selectedChat?: string | null;
  onCloseChat?: () => void;
  token: string | null;
}

export default function RealMessageArea({
  isGroupInfoCollapsed = false,
  selectedChat,
  onCloseChat,
  token
}: RealMessageAreaProps) {
  console.log("RealMessageArea rendered with props:", { selectedChat, token });

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
  const [receiverId, setReceiverId] = useState<string>("");
  const [directMessageUser, setDirectMessageUser] = useState<Employee | null>(null);
  const [showInfoDropdown, setShowInfoDropdown] = useState(false); // New state for info dropdown
  const [receiverDetails, setReceiverDetails] = useState<Employee | null>(null); // New state for receiver details
  const [loadingReceiverDetails, setLoadingReceiverDetails] = useState(false); // New state for loading receiver details
  const [isReceiverExecutive, setIsReceiverExecutive] = useState(false); // New state for receiver executive status
  const [loadingExecutiveStatus, setLoadingExecutiveStatus] = useState(false); // New state for loading executive status
  const [isUploading, setIsUploading] = useState(false); // New state for file upload status
  const [attachmentPreview, setAttachmentPreview] = useState<{ url: string, type: string, name: string } | null>(null); // New state for attachment preview
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMarkedAsRead = useRef(false);
  const lastSelectedChat = useRef<string | null>(null);

  const {
    messages,
    conversations,
    sendMessage,
    fetchMessages,
    fetchConversations,
    markMessagesAsRead,
    connected,
    error,
    loading,
    generateUploadUrl,
    fetchAllMessages // Add this new function
  } = useChat(token);

  console.log("useChat hook returned:", {
    messages: messages.length,
    conversations: conversations.length,
    connected,
    error,
    loading
  });

  // Fetch messages when conversation is selected and mark as read
  useEffect(() => {
    if (selectedChat && token) {
      // Check if selectedChat is a conversation ID
      let conversation = conversations.find(conv => conv.id === selectedChat);

      // If not found, check if selectedChat is a user ID and find conversation with that user
      if (!conversation && selectedChat) {
        conversation = conversations.find(conv => {
          // Check if the current user is one of the participants and the selectedChat is the other participant
          const isParticipantA = conv.participant_a === selectedChat;
          const isParticipantB = conv.participant_b === selectedChat;
          const match = (isParticipantA || isParticipantB) && conv.current_user_id &&
            ((isParticipantA && conv.participant_b === conv.current_user_id) ||
              (isParticipantB && conv.participant_a === conv.current_user_id));
          return match;
        });
      }

      if (conversation) {
        // If we have a conversation, fetch its messages
        fetchMessages(conversation.id);

        // Mark messages as read when opening the conversation (only once per conversation)
        if (!hasMarkedAsRead.current || lastSelectedChat.current !== selectedChat) {
          markMessagesAsRead(conversation.id);
          hasMarkedAsRead.current = true;
          lastSelectedChat.current = selectedChat;
        }
      } else {
        // If selectedChat is a user ID and no conversation exists yet, clear messages
        // Messages will be loaded after the first message is sent and a conversation is created
        console.log("Selected chat is a user ID with no existing conversation, clearing messages until conversation is created");
      }
    }

    // Reset the hasMarkedAsRead flag when selectedChat changes
    if (selectedChat !== lastSelectedChat.current) {
      hasMarkedAsRead.current = false;
      lastSelectedChat.current = selectedChat ?? null;
    }
  }, [selectedChat, token, fetchMessages, conversations, markMessagesAsRead]);

  // Auto-set receiver ID when conversation is selected
  useEffect(() => {
    console.log("useEffect triggered - Auto-set receiver ID");
    console.log("selectedChat:", selectedChat);
    console.log("conversations length:", conversations.length);
    console.log("token:", token);

    if (selectedChat) {
      console.log("Looking for conversation with ID:", selectedChat);
      console.log("Available conversations:", conversations.map(c => ({ id: c.id, participant_a: c.participant_a, participant_b: c.participant_b, current_user_id: c.current_user_id })));

      // First check if selectedChat is a conversation ID
      let conversation = conversations.find(conv => {
        const match = conv.id === selectedChat;
        console.log(`Checking conversation ${conv.id} against selected ${selectedChat}: ${match ? 'MATCH' : 'NO MATCH'}`);
        return match;
      });

      // If not found, check if selectedChat is a user ID and find conversation with that user
      if (!conversation) {
        conversation = conversations.find(conv => {
          // Check if the current user is one of the participants and the selectedChat is the other participant
          const isParticipantA = conv.participant_a === selectedChat;
          const isParticipantB = conv.participant_b === selectedChat;
          const match = (isParticipantA || isParticipantB) && conv.current_user_id &&
            ((isParticipantA && conv.participant_b === conv.current_user_id) ||
              (isParticipantB && conv.participant_a === conv.current_user_id));
          console.log(`Checking conversation ${conv.id} for user ${selectedChat}: ${match ? 'MATCH' : 'NO MATCH'}`);
          return match;
        });
      }

      console.log("Selected conversation:", conversation);
      if (conversation) {
        // Use helper function to get receiver ID
        const newReceiverId = getReceiverIdFromConversation(conversation);
        console.log("Auto-setting receiverId from conversation:", newReceiverId);
        setReceiverId(newReceiverId);
      } else {
        console.log("Conversation not found, assuming selectedChat is a user ID");
        // If no conversation found, assume selectedChat is a user ID
        // In this case, we'll set the receiverId to the selectedChat (user ID)
        // and the conversation will be created when the first message is sent
        setReceiverId(selectedChat);
      }
    } else {
      console.log("No selectedChat, clearing receiverId");
      setReceiverId("");
    }
  }, [selectedChat, conversations, token]);

  // Additional effect to handle case where conversations load after selectedChat is set
  useEffect(() => {
    if (selectedChat && conversations.length > 0) {
      console.log("Checking for conversation. Selected chat ID:", selectedChat);
      console.log("Available conversations:", conversations);

      // First check if selectedChat is a conversation ID
      let conversation = conversations.find(conv => {
        const match = conv.id === selectedChat;
        console.log(`Checking conversation ${conv.id} against selected ${selectedChat}: ${match ? 'MATCH' : 'NO MATCH'}`);
        return match;
      });

      // If not found, check if selectedChat is a user ID and find conversation with that user
      if (!conversation) {
        conversation = conversations.find(conv => {
          // Check if the current user is one of the participants and the selectedChat is the other participant
          const isParticipantA = conv.participant_a === selectedChat;
          const isParticipantB = conv.participant_b === selectedChat;
          const match = (isParticipantA || isParticipantB) && conv.current_user_id &&
            ((isParticipantA && conv.participant_b === conv.current_user_id) ||
              (isParticipantB && conv.participant_a === conv.current_user_id));
          console.log(`Checking conversation ${conv.id} for user ${selectedChat}: ${match ? 'MATCH' : 'NO MATCH'}`);
          return match;
        });
      }

      if (conversation) {
        console.log("Found conversation:", conversation);
        // Always update receiverId when conversation data changes
        const newReceiverId = getReceiverIdFromConversation(conversation);
        if (newReceiverId && newReceiverId !== receiverId) {
          console.log("Updating receiverId to:", newReceiverId);
          setReceiverId(newReceiverId);
        }

        // Load messages for the conversation
        fetchMessages(conversation.id);

        // Mark messages as read when opening the conversation (only once per conversation)
        if (!hasMarkedAsRead.current || lastSelectedChat.current !== selectedChat) {
          markMessagesAsRead(conversation.id);
          hasMarkedAsRead.current = true;
          lastSelectedChat.current = selectedChat;
        }
      } else {
        console.log("Conversation still not found after conversations loaded");
      }
    }
  }, [conversations.length, selectedChat, conversations, token, receiverId, fetchMessages, markMessagesAsRead]);

  // Fetch user details when we have a user ID but no conversation
  useEffect(() => {
    const fetchUserDetails = async () => {
      // Check if selectedChat is a user ID (not a conversation ID) and we don't have a conversation for it
      // First check if selectedChat is a conversation ID
      let conversation = conversations.find(conv => conv.id === selectedChat);

      // If not found, check if selectedChat is a user ID and find conversation with that user
      if (!conversation && selectedChat) {
        conversation = conversations.find(conv => {
          // Check if the current user is one of the participants and the selectedChat is the other participant
          const isParticipantA = conv.participant_a === selectedChat;
          const isParticipantB = conv.participant_b === selectedChat;
          const match = (isParticipantA || isParticipantB) && conv.current_user_id &&
            ((isParticipantA && conv.participant_b === conv.current_user_id) ||
              (isParticipantB && conv.participant_a === conv.current_user_id));
          return match;
        });
      }

      if (selectedChat && !conversation) {
        try {
          // Fetch user details from the public API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/hq/employees/public/${selectedChat}`);

          if (response.ok) {
            const data = await response.json();
            setDirectMessageUser(data.data.employee);
            console.log("User details for direct message:", data.data.employee);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        // Clear the direct message user if we have a conversation
        setDirectMessageUser(null);
      }
    };

    fetchUserDetails();
  }, [selectedChat, conversations]);

  // Fetch receiver details when receiverId changes
  useEffect(() => {
    const fetchReceiverDetails = async () => {
      if (receiverId) {
        try {
          setLoadingReceiverDetails(true);
          // Fetch user details from the public API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/hq/employees/public/${receiverId}`);

          if (response.ok) {
            const data = await response.json();
            setReceiverDetails(data.data.employee);
          }
        } catch (error) {
          console.error("Error fetching receiver details:", error);
        } finally {
          setLoadingReceiverDetails(false);
        }
      } else {
        setReceiverDetails(null);
      }
    };

    fetchReceiverDetails();
  }, [receiverId]);

  // Check executive status when receiver details change
  useEffect(() => {
    const checkExecutiveStatus = async () => {
      if (receiverDetails?.employee_id) {
        try {
          setLoadingExecutiveStatus(true);
          // Fetch executive status from the public API using employee_id
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/hq/executive/status/${receiverDetails.employee_id}`);

          if (response.ok) {
            const data = await response.json();
            setIsReceiverExecutive(data.data.isExecutive);
          }
        } catch (error) {
          console.error("Error checking executive status:", error);
          setIsReceiverExecutive(false);
        } finally {
          setLoadingExecutiveStatus(false);
        }
      } else {
        setIsReceiverExecutive(false);
      }
    };

    checkExecutiveStatus();
  }, [receiverDetails]);

  // Helper function to get receiver ID from conversation
  const getReceiverIdFromConversation = (conversation: any) => {
    console.log("Getting receiver ID from conversation:", conversation);

    // If we have current_user_id, we can determine receiver automatically
    if (conversation.current_user_id) {
      // Handle case where both participants are the same (invalid conversation)
      if (conversation.participant_a === conversation.participant_b) {
        console.log("Warning: Both participants are the same in conversation");
        return "";
      }

      const receiver = conversation.participant_a === conversation.current_user_id
        ? conversation.participant_b
        : conversation.participant_a;
      console.log("Determined receiver ID:", receiver);
      return receiver;
    }
    // If we don't have current_user_id but have participants, try to get current user ID from localStorage
    else if (conversation.participant_a && conversation.participant_b) {
      // Try to get the current user ID from localStorage
      let currentUserId = null;

      // Try different possible keys for employee ID
      const possibleKeys = ['employee_id', 'user_id', 'current_user_id'];
      for (const key of possibleKeys) {
        currentUserId = localStorage.getItem(key);
        if (currentUserId) {
          console.log("Found user ID in localStorage key:", key, "value:", currentUserId);
          break;
        }
      }

      // If still not found, try to parse from token
      if (!currentUserId && token) {
        try {
          // Decode JWT token to get user ID
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            currentUserId = payload.id || payload.employee_id || payload.user_id;
            console.log("Found user ID in token payload:", currentUserId);
          }
        } catch (e) {
          console.log("Failed to decode token:", e);
        }
      }

      if (currentUserId) {
        // Handle case where both participants are the same (invalid conversation)
        if (conversation.participant_a === conversation.participant_b) {
          console.log("Warning: Both participants are the same in conversation");
          return "";
        }

        const receiver = conversation.participant_a === currentUserId
          ? conversation.participant_b
          : conversation.participant_a;
        console.log("Determined receiver ID from token/localStorage:", receiver);
        return receiver;
      }
    }

    console.log("Could not determine receiver ID");
    return "";
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachmentPreview({
            url: e.target?.result as string,
            type: file.type,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      } else {
        // For non-image files, show file icon preview
        setAttachmentPreview({
          url: '',
          type: file.type,
          name: file.name
        });
      }
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!token || !generateUploadUrl) return null;

    try {
      setIsUploading(true);

      // Generate upload URL
      const uploadData = await generateUploadUrl(file.name, file.type, file.size);

      if (!uploadData) {
        throw new Error('Failed to generate upload URL');
      }

      const { uploadUrl, fileUrl } = uploadData;

      // Upload file to S3
      const s3Response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!s3Response.ok) {
        throw new Error('Failed to upload file to S3');
      }

      return fileUrl;
    } catch (error) {
      console.error('File upload error:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !attachmentPreview) || !receiverId || !token || !connected) {
      console.log("Message not sent - missing data:", {
        message: message.trim(),
        attachmentPreview,
        receiverId,
        token: !!token,
        connected
      });
      return;
    }

    let attachmentUrl = null;

    // Handle file upload if there's an attachment
    if (attachmentPreview && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      attachmentUrl = await handleFileUpload(file);

      if (!attachmentUrl) {
        console.error("Failed to upload attachment");
        return;
      }
    }

    console.log("Sending message:", { receiverId, message, attachmentUrl });
    sendMessage(receiverId, message, attachmentUrl);
    setMessage("");
    setAttachmentPreview(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Function to remove attachment
  const removeAttachment = () => {
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to toggle info dropdown
  const toggleInfoDropdown = () => {
    setShowInfoDropdown(!showInfoDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('info-dropdown');
      const infoButton = document.getElementById('info-button');
      if (dropdown && !dropdown.contains(event.target as Node) &&
        infoButton && !infoButton.contains(event.target as Node)) {
        setShowInfoDropdown(false);
      }
    };

    if (showInfoDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInfoDropdown]);

  // Function to get current user's ID from localStorage or token
  const getCurrentUserId = () => {
    if (typeof window !== 'undefined') {
      // Try different possible keys for employee ID
      const possibleKeys = ['employee_id', 'user_id', 'current_user_id'];
      for (const key of possibleKeys) {
        const userId = localStorage.getItem(key);
        if (userId) {
          console.log("Found user ID in localStorage key:", key, "value:", userId);
          return userId;
        }
      }

      // If still not found, try to parse from token
      if (token) {
        try {
          // Decode JWT token to get user ID
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const userId = payload.id || payload.employee_id || payload.user_id;
            console.log("Found user ID in token payload:", userId);
            return userId;
          }
        } catch (e) {
          console.log("Failed to decode token:", e);
        }
      }
    }
    return null;
  };

  // Function to get current user's name from localStorage or token
  const getCurrentUserName = () => {
    if (typeof window !== 'undefined') {
      // Try to get user data from localStorage
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          return parsedData.full_name || parsedData.name || "You";
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }

      // If not in localStorage, try to get from token
      if (token) {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            return payload.full_name || payload.name || "You";
          }
        } catch (e) {
          console.error('Failed to decode token', e);
        }
      }
    }
    return "You";
  };

  // Function to export chat history as PDF
  const exportChatToPDF = async () => {
    if (!selectedChat || !token) return;

    // Find the selected conversation
    let selectedConversation = conversations.find(conv => conv.id === selectedChat);

    // If not found, check if selectedChat is a user ID and find conversation with that user
    if (!selectedConversation && selectedChat) {
      selectedConversation = conversations.find(conv => {
        // Check if the current user is one of the participants and the selectedChat is the other participant
        const isParticipantA = conv.participant_a === selectedChat;
        const isParticipantB = conv.participant_b === selectedChat;
        const match = (isParticipantA || isParticipantB) && conv.current_user_id &&
          ((isParticipantA && conv.participant_b === conv.current_user_id) ||
            (isParticipantB && conv.participant_a === conv.current_user_id));
        return match;
      });
    }

    if (!selectedConversation) {
      console.error("No conversation found to export");
      return;
    }

    // Show loading state
    setLoadingReceiverDetails(true);

    try {
      // Get current user's actual name instead of the conversation participant name
      const currentUser = getCurrentUserName();
      const otherUser = receiverDetails?.full_name || "Other User";

      // Get current user's ID for message sender identification
      const currentUserId = getCurrentUserId();

      // Format date for export
      const currentDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      // Fetch all messages for this conversation
      const allMessages = await fetchAllMessages(selectedConversation.id);

      // Create new PDF document
      const doc = new jsPDF();

      // Add company header
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Intellaris Private Limited", 105, 20, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("OrgSpace Chats", 105, 30, { align: "center" });

      // Add separator line
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      // Add conversation info
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Chats between ${currentUser} and ${otherUser}`, 105, 45, { align: "center" });
      doc.text(`${currentDate}`, 105, 52, { align: "center" });

      // Add separator line
      doc.setLineWidth(0.3);
      doc.line(20, 57, 190, 57);

      // Add "Chats:" heading
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Chats:", 20, 65);

      // Add messages
      let yPos = 75;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      allMessages.forEach((msg, index) => {
        // Use the actual current user's ID for comparison instead of selectedConversation!.current_user_id
        const senderName = msg.sender_id === currentUserId ? currentUser : (msg.sender_name || "Other User");
        const messageText = `${senderName}: ${msg.content}`;

        // Split text to fit within page width
        const splitText = doc.splitTextToSize(messageText, 170);

        // Check if we need a new page
        const textHeight = splitText.length * 7; // Approximate height per line
        if (yPos + textHeight > pageHeight - margin) {
          doc.addPage();
          yPos = 20;
        }

        // Add message text
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(splitText, 20, yPos);

        yPos += textHeight + 5; // Add some spacing between messages
      });

      // Save the PDF
      doc.save(`chat-export-${selectedConversation.id}.pdf`);
    } catch (error) {
      console.error("Error exporting chat to PDF:", error);
    } finally {
      setLoadingReceiverDetails(false);
    }
  };

  // Show no-chat-selected component if no chat is selected
  if (!selectedChat) {
    // Show loading spinner while conversations are being fetched
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center bg-black">
          <div className="iphone-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <NoChatSelected />
        </div>
      </div>
    );
  }

  // Show loading spinner while conversations are being fetched
  // Show spinner when loading is true, regardless of whether we have conversations or not
  // This provides better UX when refreshing or when conversations are being updated
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="iphone-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  // Show loading indicator while messages are being fetched for a conversation
  const conversation = conversations.find(conv => conv.id === selectedChat);
  if (selectedChat && conversation && messages.length === 0 && !error) {
    // Check if we're still loading messages for this conversation
    // We can determine this by checking if we have conversations but no messages yet
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="iphone-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  // Find the selected conversation or create a temporary one for display
  let selectedConversation = conversations.find(conv => conv.id === selectedChat);

  // If not found, check if selectedChat is a user ID and find conversation with that user
  if (!selectedConversation && selectedChat) {
    selectedConversation = conversations.find(conv => {
      // Check if the current user is one of the participants and the selectedChat is the other participant
      const isParticipantA = conv.participant_a === selectedChat;
      const isParticipantB = conv.participant_b === selectedChat;
      const match = (isParticipantA || isParticipantB) && conv.current_user_id &&
        ((isParticipantA && conv.participant_b === conv.current_user_id) ||
          (isParticipantB && conv.participant_a === conv.current_user_id));
      return match;
    });
  }

  // If still not found, use direct message user info
  if (!selectedConversation && directMessageUser) {
    selectedConversation = {
      id: directMessageUser.id,
      participant_name: directMessageUser.full_name,
      participant_avatar: directMessageUser.profile_image_url,
      current_user_id: undefined,
      participant_a: "", // Required properties with empty values
      participant_b: "",
      last_message_id: "",
      updated_at: ""
    };
  }

  // Determine if the current user is the sender of a message
  const isCurrentUserMessage = (senderId: string) => {
    return selectedConversation?.current_user_id === senderId;
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      <div key={selectedChat} className="absolute inset-0">
        <div className="flex h-full flex-col">
          {/* Info Banner */}
          <style>
            {`
              @keyframes seamless-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-100%); }
              }
              .mobile-marquee-item {
                display: flex;
                align-items: center;
                flex-shrink: 0;
                padding-right: 2rem;
                white-space: nowrap;
                animation: seamless-marquee 20s linear infinite;
              }
              @media (min-width: 768px) {
                .mobile-marquee-item {
                  animation: none;
                  padding-right: 0;
                  white-space: normal;
                  width: auto;
                  transform: none;
                  display: flex;
                  justify-content: center;
                }
                .mobile-marquee-item:nth-child(2) {
                  display: none;
                }
              }
            `}
          </style>
          <div className="bg-blue-600 py-2 mt-0 text-white text-sm font-medium flex items-center overflow-hidden md:justify-center md:px-3">
            <div className="flex w-full md:w-auto md:justify-center">
              <div className="mobile-marquee-item px-4 md:px-0">
                <InfoIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  Sent messages can't be edited or deleted. Communicate responsibly. Direct messages are private but still subject to company policy.
                </span>
              </div>
              <div className="mobile-marquee-item px-4 md:px-0">
                <InfoIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  Sent messages can't be edited or deleted. Communicate responsibly. Direct messages are private but still subject to company policy.
                </span>
              </div>
            </div>
          </div>

          {/* Chat Header */}
          <div className="p-4 bg-black border-b border-white/10 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              {selectedConversation?.participant_avatar && (
                <Avatar className="w-10 h-10 border border-[#2a2a2a]">
                  <AvatarImage src={selectedConversation.participant_avatar} />
                  <AvatarFallback className="bg-[#2a2a2a] text-xs">
                    {selectedConversation.participant_name?.split(" ").map(n => n[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <h2 className="text-lg font-semibold text-gray-100 flex items-center">
                {selectedConversation?.participant_name && selectedConversation.participant_name !== "Unknown User"
                  ? selectedConversation.participant_name
                  : ''}
                {/* Badge slightly lower - only show if receiver is executive */}
                {isReceiverExecutive && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 relative top-0.5">
                    <img
                      src="/special/executive.svg"
                      alt="Executive"
                      className="w-4 h-4"
                    />
                  </span>
                )}
              </h2>
              {/* {!connected && (
                <div className="flex items-center gap-1 text-xs text-white/10">
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  <span>Disconnected</span>
                </div>
              )} */}
            </div>

            <div className="flex items-center gap-4">
              {/* Export Chat Button */}
              {/* <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300"
                onClick={exportChatToPDF}
                title="Export chat"
                disabled={!selectedConversation || messages.length === 0}
              >
                <Download className="w-4 h-4" />
              </Button> */}
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300"
                onClick={() => fetchConversations()}
                title="Refresh conversations"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300"
                onClick={() => {
                  // Call the close chat callback if provided
                  if (onCloseChat) {
                    onCloseChat();
                  }

                  // Add a very short delay to make the UI feel more responsive
                  // before refreshing the page to avoid a jarring experience
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                }}
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {/* <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300">
                  <Phone className="w-4 h-4" />
                </Button> */}
                {/* <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300">
                  <Video className="w-4 h-4" />
                </Button> */}
                {/* <Button variant="ghost" size="icon" className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300">
                  <MessageCircle className="w-4 h-4" />
                </Button> */}
                <div className="relative">
                  <Button
                    id="info-button"
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300"
                    onClick={toggleInfoDropdown}
                    title="User information"
                  >
                    <Info className="w-4 h-4" />
                  </Button>

                  {/* Info Dropdown */}
                  {showInfoDropdown && (
                    <div
                      id="info-dropdown"
                      className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl shadow-lg z-50"
                    >
                      {loadingReceiverDetails ? (
                        <div className="flex items-center justify-center p-6">
                          <div className="iphone-spinner">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                      ) : receiverDetails ? (
                        <div className="flex flex-col items-center p-6">
                          <Avatar className="h-20 w-20 mb-4">
                            <AvatarImage src={receiverDetails.profile_image_url || "/profile/default.png"} alt={receiverDetails.full_name} />
                            <AvatarFallback className="bg-[#1a1a1a] text-gray-300 text-2xl">
                              {receiverDetails.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-center text-center w-full">
                            <h3 className="text-lg font-semibold text-white">{receiverDetails.full_name}</h3>
                            <p className="text-gray-400 mt-1">{receiverDetails.job_title}</p>
                            <div className="flex items-center justify-center gap-2 mt-1 text-sm text-gray-500">
                              <span>{receiverDetails.department}</span>
                              <div className="w-px h-4 bg-gray-600"></div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{receiverDetails.location || 'Location not specified'}</span>
                              </div>
                            </div>

                            {/* Additional details */}
                            <div className="w-full mt-4 space-y-2">
                              <div className="flex items-center justify-between py-2">
                                <span className="text-gray-500 text-sm">Employee ID</span>
                                <span className="text-white text-sm">{receiverDetails.employee_id}</span>
                              </div>
                              {/* <div className="flex items-center justify-between py-2 border-b border-[#2a2a2a]">
                                <span className="text-gray-500 text-sm">Email</span>
                                <div className="flex items-center gap-1">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-white text-sm">{receiverDetails.work_email}</span>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-6">
                          <div className="text-center">
                            <Building className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-300 mb-2">User not found</h3>
                            <p className="text-gray-500 text-sm">Could not load user details</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-black scrollbar-hide px-4 md:px-6 py-4">
            <div className={`space-y-6 ${isGroupInfoCollapsed ? 'max-w-6xl' : 'max-w-4xl'} min-h-full pt-4`}>
              {/* {error && (
                <div className="bg-white/5 border border-none rounded-lg p-3 text-white/10 text-sm">
                  Error: {error}
                </div>
              )} */}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isCurrentUserMessage(msg.sender_id) ? "justify-end" : "justify-start"}`}
                >

                  <div className={`flex-1 ${isCurrentUserMessage(msg.sender_id) ? "flex flex-col items-end" : "flex flex-col items-start"}`}>
                    {!isCurrentUserMessage(msg.sender_id) && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-300">
                          {/* {msg.sender_name || "Unknown User"} */}
                        </span>
                      </div>
                    )}

                    <div className={`inline-block max-w-[80%] ${isCurrentUserMessage(msg.sender_id) ? "max-w-lg" : "max-w-2xl"}`}>
                      <div
                        className={`px-4 py-2.5 shadow-lg font-semibold text-[18px] ${isCurrentUserMessage(msg.sender_id)
                          ? "text-white bg-blue-600 rounded-2xl rounded-tr-none"
                          : "text-white bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl rounded-tl-none"
                          }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      </div>

                      {msg.attachment_url && (
                        <div className="mt-2" style={{ paddingLeft: isCurrentUserMessage(msg.sender_id) ? '0' : '1.5rem', paddingRight: isCurrentUserMessage(msg.sender_id) ? '1.5rem' : '0' }}>
                          {msg.attachment_url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                            <div
                              className="aspect-[3/4] rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden shadow-lg shadow-black/30 cursor-pointer hover:border-[#3a3a3a] transition-colors max-w-xs"
                              onClick={() => openMediaViewer(msg.attachment_url!, 'image')}
                            >
                              <img
                                src={msg.attachment_url}
                                alt="Attachment"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                          ) : (
                            <div
                              className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] cursor-pointer transition-colors max-w-xs"
                              onClick={() => openMediaViewer(msg.attachment_url!, 'image', 'Attachment')}
                            >
                              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <File className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-300 truncate">
                                  Attachment
                                </p>
                                <p className="text-xs text-gray-500">
                                  Click to view
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Attachment Preview */}
          {attachmentPreview && (
            <div className="px-6 py-2 bg-[#0a0a0a] border-t border-[#1f1f1f]">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg p-2">
                  {attachmentPreview.type.startsWith('image/') && attachmentPreview.url ? (
                    <div className="relative">
                      <img
                        src={attachmentPreview.url}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <File className="w-8 h-8 text-blue-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-300 truncate">
                      {attachmentPreview.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {attachmentPreview.type.startsWith('image/') ? 'Image' : 'File'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-gray-500 hover:bg-[#2a2a2a] hover:text-gray-300"
                    onClick={removeAttachment}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 bg-[#0a0a0a] border-t border-[#1f1f1f]">
            <div className={`flex items-center gap-3 ${isGroupInfoCollapsed ? 'max-w-6xl' : 'max-w-4xl'} mx-auto`}>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              {/* <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 h-9 text-gray-500 hover:bg-[#1a1a1a] hover:text-gray-300 flex-shrink-0"
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="iphone-spinner scale-50">
                    <div></div><div></div><div></div><div></div>
                  </div>
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
              </Button> */}
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="bg-[#1a1a1a] border-none text-white placeholder:text-gray-600 h-11 rounded-xl pr-10 focus-visible:ring-0 focus-visible:ring-[#4a9eff]"
                />
              </div>
              <Button
                className="w-11 h-11 rounded-xl cursor-pointer 
                          hover:bg-white/10 text-white 
                          shadow-[0_0_10px_2px_rgba(255,255,255,0.6)]
                          hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.9)]
                          transition-all duration-300
                          flex-shrink-0"
                onClick={handleSendMessage}
                disabled={(!message.trim() && !attachmentPreview) || !receiverId || !connected || isUploading}
              >
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