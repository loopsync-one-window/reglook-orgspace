import { useState, useEffect, useCallback } from 'react';

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
  unread_count?: number; // Add unread count property
}

export const useConversations = (token: string | null) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch conversations
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://orgspace.reglook.com'}/api/v1/intranet/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      console.log("Fetched conversations data:", data);
      console.log("Conversations array:", data.data);

      setConversations(data.data || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, [token, fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refresh: fetchConversations,
  };
};