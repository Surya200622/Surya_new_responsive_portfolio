'use client';

import { useEffect, useState, useRef } from 'react';

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
};

export function useRealtimeMessages(currentUserId: string, otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fetchedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?otherUserId=${otherUserId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(prev => {
            const dataIds = new Set(data.map((m: Message) => m.id));
            const optimisticMessages = prev.filter(m => m.id.startsWith('temp-') && !dataIds.has(m.id));
            return [...data, ...optimisticMessages];
          });
          
          // Mark unread messages as read
          const unreadIds = data
            .filter((m: Message) => m.receiverId === currentUserId && !m.isRead)
            .map((m: Message) => m.id);

          if (unreadIds.length > 0) {
            await fetch('/api/chat/messages/read', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ unreadIds })
            });
            
            setMessages(prev => prev.map(m => 
              unreadIds.includes(m.id) ? { ...m, isRead: true } : m
            ));
          }
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Poll for new messages every 3 seconds
    const intervalId = setInterval(fetchMessages, 3000);

    return () => {
      clearInterval(intervalId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [currentUserId, otherUserId]);

  const sendMessage = async (content: string, fileData?: { url: string; name: string }) => {
    const tempId = 'temp-' + (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now());
    const tempMessage: Message = {
      id: tempId,
      senderId: currentUserId,
      receiverId: otherUserId,
      content,
      fileUrl: fileData?.url,
      fileName: fileData?.name,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: otherUserId,
          content,
          fileUrl: fileData?.url,
          fileName: fileData?.name,
        })
      });

      if (!res.ok) throw new Error('Failed to send');
      const data = await res.json();

      // Replace temp with real
      setMessages((prev) => prev.map(m => m.id === tempId ? data : m));

      // Send a notification
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: otherUserId,
          title: 'New Message',
          message: content.length > 50 ? content.substring(0, 50) + '...' : content,
          type: 'message',
          link: '/dashboard/messages'
        })
      }).catch(e => console.warn('Notification failed:', e));
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter(m => m.id !== tempId));
      throw error;
    }
  };

  const setTyping = async () => {
    // Polling handles new messages. We can skip typing indicator or simulate it.
    // Realtime typing requires websockets. We can mock it or omit it for polling.
  };

  return { messages, isTyping, isLoading, sendMessage, setTyping };
}
