import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

import { Message } from '@/interfaces/Message';

interface Conversation {
  id: string;
  participant_a: string;
  participant_b: string;
  last_message_id: string;
  updated_at: string;
  participant_name?: string;
  participant_avatar?: string;
  last_message_content?: string;
  last_message_time?: string;
  current_user_id?: string;
  unread_count?: number;
}

export const useChat = (token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const hasFetchedConversations = useRef(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMarkReadTime = useRef<number>(0);
  const lastFetchTime = useRef<number>(0);

  // Fetch conversations from API with rate limiting
  const fetchConversations = useCallback(async () => {
    if (!token) {
      console.log("No token available, skipping conversation fetch");
      return;
    }

    // Prevent multiple simultaneous fetches
    if (loading) {
      console.log("Already fetching conversations, skipping");
      return;
    }

    // Rate limiting - only allow fetch every 1000ms
    const now = Date.now();
    if (now - lastFetchTime.current < 1000) {
      console.log("Skipping conversation fetch due to rate limiting");
      return;
    }

    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Debounce the fetch to prevent rapid calls
    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        lastFetchTime.current = Date.now();
        console.log("Fetching conversations with token:", token.substring(0, 20) + "...");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/chat/conversations`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("Conversation fetch response status:", response.status);
        console.log("Conversation fetch response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Conversation fetch failed with response:", errorText);
          throw new Error(`Failed to fetch conversations: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Fetched conversations data:", data);
        setConversations(data.data || []);
        hasFetchedConversations.current = true;
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce delay
  }, [token]);

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com', {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setConnected(true);
      setError(null);

      // Fetch conversations when connected (only if not already fetched)
      if (token && !hasFetchedConversations.current) {
        console.log("Socket connected, fetching conversations");
        fetchConversations();
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from chat server:', reason);
      setConnected(false);

      // If it's a forced disconnection, don't try to reconnect
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to chat server');
      setConnected(false);
    });

    newSocket.on('receive_message', (message: Message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);

      // Update the conversations list to show the latest message
      setConversations(prevConversations => {
        return prevConversations.map(conversation => {
          if (conversation.id === message.conversation_id) {
            return {
              ...conversation,
              last_message_content: message.content,
              last_message_time: message.created_at.toString(),
              unread_count: conversation.current_user_id === message.receiver_id
                ? (conversation.unread_count || 0) + 1
                : conversation.unread_count
            };
          }
          return conversation;
        });
      });
    });

    // Add a listener for when a new conversation is created
    newSocket.on('conversation_created', (conversation: Conversation) => {
      console.log('New conversation created:', conversation);
      // Add the new conversation to the list
      setConversations(prev => [conversation, ...prev]);
    });

    newSocket.on('message_delivered', (data) => {
      console.log('Message delivered:', data);
      // Update message status in UI
    });

    newSocket.on('message_read', (data) => {
      console.log('Message read:', data);
      // Update message status in UI
    });

    newSocket.on('typing', (data) => {
      const { from, isTyping } = data;
      setTypingUsers(prev => ({
        ...prev,
        [from]: isTyping,
      }));

      // Clear typing indicator after 3 seconds
      if (isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => ({
            ...prev,
            [from]: false,
          }));
        }, 3000);
      }
    });

    // Handle unread count updates - more efficient approach
    newSocket.on('unread_count_update', (data) => {
      console.log('Unread count update:', data);
      // Instead of refetching all conversations, update the specific conversation
      if (data.conversationId && data.count !== undefined) {
        setConversations(prevConversations => {
          return prevConversations.map(conversation => {
            if (conversation.id === data.conversationId) {
              return {
                ...conversation,
                unread_count: data.count
              };
            }
            return conversation;
          });
        });
      } else {
        // Fallback to fetching all conversations if needed (rate limited)
        fetchConversations();
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();

      // Clear any pending fetch timeout
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [token, fetchConversations]);

  // Reset fetch flag and loading state when token changes
  useEffect(() => {
    if (token) {
      hasFetchedConversations.current = false;
    }
    // Reset loading state when token changes
    setLoading(false);

    // Clear any pending fetch timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }

    // Reset last mark read time and fetch time
    lastMarkReadTime.current = 0;
    lastFetchTime.current = 0;
  }, [token]);

  // Fetch conversations when token changes (only once)
  useEffect(() => {
    if (token && !hasFetchedConversations.current) {
      console.log("Token available, fetching conversations");
      fetchConversations();
    }
  }, [token, fetchConversations]);

  // Send message
  const sendMessage = useCallback((receiverId: string, content: string, attachmentUrl?: string) => {
    if (!socket || !connected) {
      setError('Not connected to chat server');
      return;
    }

    const tempId = `temp_${Date.now()}`;

    // Emit message to server
    socket.emit('send_message', {
      to: receiverId,
      content,
      attachmentUrl,
      tempId
    });

    console.log('Sent message:', { receiverId, content, attachmentUrl });
  }, [socket, connected]);

  // Send typing indicator
  const sendTyping = useCallback((receiverId: string, isTyping: boolean) => {
    if (!socket || !connected) return;

    socket.emit('typing', {
      to: receiverId,
      isTyping,
    });
  }, [socket, connected]);

  // Mark messages as read with rate limiting
  const markMessagesAsRead = useCallback((conversationId: string, lastReadMessageId?: string) => {
    if (!socket || !connected) return;

    // Rate limiting - only allow one mark as read per 100ms
    const now = Date.now();
    if (now - lastMarkReadTime.current < 100) {
      console.log('Skipping mark as read due to rate limiting');
      return;
    }

    lastMarkReadTime.current = now;

    socket.emit('message_read', {
      conversationId,
      messageId: lastReadMessageId,
    });

    // Immediately update the conversation's unread count to 0 in the UI
    setConversations(prevConversations => {
      return prevConversations.map(conversation => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            unread_count: 0
          };
        }
        return conversation;
      });
    });
  }, [socket, connected]);

  // Subscribe to presence updates
  const subscribeToPresence = useCallback((userIds: string[]) => {
    if (!socket || !connected) return;

    socket.emit('presence_subscribe', {
      userIds,
    });
  }, [socket, connected]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      // Also clear messages on error to avoid showing stale data
      setMessages([]);
    }
  }, [token]);

  // Fetch all messages for a conversation (for export)
  const fetchAllMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    if (!token) return [];

    try {
      // Fetch all messages for a conversation using pagination
      let allMessages: Message[] = [];
      let before: string | undefined = undefined;
      const limit = 100; // Maximum allowed by API

      // Keep fetching until we get all messages
      while (true) {
        let url = `${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/chat/conversations/${conversationId}/messages?limit=${limit}`;
        if (before) {
          url += `&before=${before}`;
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const messages = data.data || [];

        // Add these messages to our collection
        allMessages = [...allMessages, ...messages];

        // If we got fewer messages than the limit, we've reached the end
        if (messages.length < limit) {
          break;
        }

        // Set the before parameter to the created_at of the last message for the next request
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          before = lastMessage.created_at;
        } else {
          // No more messages to fetch
          break;
        }
      }

      return allMessages;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      return [];
    }
  }, [token]);

  // Generate upload URL for attachments
  const generateUploadUrl = useCallback(async (fileName: string, fileType: string, size: number) => {
    if (!token) return null;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/chat/upload-url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          fileType,
          size,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate upload URL');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate upload URL');
      return null;
    }
  }, [token]);

  return {
    // State
    connected,
    messages,
    conversations,
    typingUsers,
    error,
    loading,

    // Actions
    sendMessage,
    sendTyping,
    markMessagesAsRead,
    subscribeToPresence,
    fetchConversations,
    fetchMessages,
    fetchAllMessages, // Add this new function
    generateUploadUrl,
  };
};