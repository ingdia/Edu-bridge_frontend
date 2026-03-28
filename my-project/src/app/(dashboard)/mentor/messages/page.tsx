'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  fetchConversations, fetchConversation, sendMessage, markMessagesRead,
  type Conversation, type ChatMessage,
} from '@/lib/api/mentorship';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function MentorMessages() {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [activeConv, setActiveConv]       = useState<Conversation | null>(null);
  const [input, setInput]                 = useState('');
  const [search, setSearch]               = useState('');
  const [loading, setLoading]             = useState(true);
  const [sending, setSending]             = useState(false);
  const bottomRef                         = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
      if (data.length > 0 && !activeConv) setActiveConv(data[0]);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [activeConv]);

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    if (!activeConv) return;
    fetchConversation(activeConv.otherUserId)
      .then(setMessages)
      .catch(() => {});
    markMessagesRead(activeConv.otherUserId).catch(() => {});
  }, [activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConv) return;
    setSending(true);
    try {
      const msg = await sendMessage(activeConv.otherUserId, input.trim());
      setMessages((prev) => [...prev, msg]);
      setInput('');
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filtered = conversations.filter((c) =>
    c.otherUserName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversation list */}
      <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 space-y-2">
          <h1 className="text-sm font-semibold text-gray-900">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">No conversations yet.</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.otherUserId}
                onClick={() => { setActiveConv(c); setInput(''); }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                  activeConv?.otherUserId === c.otherUserId ? 'bg-emerald-50 border-l-2 border-l-emerald-600' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initials(c.otherUserName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 truncate">{c.otherUserName}</span>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-1">{timeAgo(c.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                </div>
                {c.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {c.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat window */}
      {activeConv ? (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">
              {initials(activeConv.otherUserName)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{activeConv.otherUserName}</p>
              <p className="text-xs text-gray-400">{activeConv.otherUserRole}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.map((m) => {
              const isMe = m.senderId === user?.id;
              return (
                <div key={m.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                  {!isMe && (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold mr-2 shrink-0 mt-1">
                      {initials(activeConv.otherUserName)}
                    </div>
                  )}
                  <div className={cn('max-w-xs flex flex-col gap-1', isMe ? 'items-end' : 'items-start')}>
                    <div className={cn(
                      'px-4 py-2.5 rounded-2xl text-sm',
                      isMe ? 'bg-emerald-700 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    )}>
                      {m.content}
                    </div>
                    <span className="text-[10px] text-gray-400 px-1">{timeAgo(m.createdAt)}</span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center text-white hover:bg-emerald-800 disabled:bg-gray-200 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex items-center justify-center">
          <p className="text-sm text-gray-400">Select a conversation to start messaging.</p>
        </div>
      )}
    </div>
  );
}
