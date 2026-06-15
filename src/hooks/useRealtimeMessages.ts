'use client';

import { useEffect, useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  file_url?: string;
  file_name?: string;
  is_read: boolean;
  created_at: string;
};

export function useRealtimeMessages(currentUserId: string, otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    // 1. Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
        // Mark as read
        const unreadIds = data.filter(m => m.receiver_id === currentUserId && !m.is_read).map(m => m.id);
        if (unreadIds.length > 0) {
          await supabase.from('messages').update({ is_read: true }).in('id', unreadIds);
        }
      }
      setIsLoading(false);
    };

    fetchMessages();

    // 2. Subscribe to new messages
    const messageChannel = supabase.channel(`messages:${currentUserId}:${otherUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`, // Only listen to incoming messages to avoid duplicates
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          // Check if it belongs to this conversation
          if (newMessage.sender_id === otherUserId) {
            setMessages((prev) => [...prev, newMessage]);
            // Auto mark as read if we are in this conversation
            await supabase.from('messages').update({ is_read: true }).eq('id', newMessage.id);
          }
        }
      )
      .subscribe();

    // 3. Subscribe to typing indicator via Broadcast
    const typingChannel = supabase.channel(`typing:${otherUserId}:${currentUserId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.isTyping) {
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
        } else {
          setIsTyping(false);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(typingChannel);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [currentUserId, otherUserId, supabase]);

  const sendMessage = async (content: string, fileData?: { url: string; name: string }) => {
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempMessage: Message = {
      id: tempId,
      sender_id: currentUserId,
      receiver_id: otherUserId,
      content,
      file_url: fileData?.url,
      file_name: fileData?.name,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, tempMessage]);

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUserId,
        receiver_id: otherUserId,
        content,
        file_url: fileData?.url,
        file_name: fileData?.name,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      // Remove temp message on failure
      setMessages((prev) => prev.filter(m => m.id !== tempId));
      throw error;
    }

    // Send a notification to the receiver
    try {
      // Need user's name for notification title (optional, could fetch from profile context, but generic is fine for now)
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: otherUserId,
          title: 'New Message',
          message: content.length > 50 ? content.substring(0, 50) + '...' : content,
          type: 'message',
          link: '/dashboard/messages' // or /admin/messages
        })
      });
    } catch (notifError) {
      console.warn('Failed to send message notification:', notifError);
    }

    // Replace temp message with actual message
    setMessages((prev) => prev.map(m => m.id === tempId ? (data as Message) : m));
  };

  const setTyping = async () => {
    const channel = supabase.channel(`typing:${currentUserId}:${otherUserId}`);
    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { isTyping: true }
    });
  };

  return { messages, isTyping, isLoading, sendMessage, setTyping };
}
