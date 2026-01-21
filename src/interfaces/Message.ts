export interface Message {
  sender_name: string;
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  attachment_url: string;
  is_delivered: boolean;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}