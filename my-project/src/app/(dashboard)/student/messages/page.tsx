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

export default function StudentMessages() {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [activeConv, setActiveConv]       = useState<Conversation | null>(null);
  const [input, setInput]                 = useState('');
  const [search, setSearch]               = useState('');
  const [loading, setLoading]             = useState(true);
  const [sending, setSending]             = useState(false);
  const bottomRef                         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations()
      .then((data) => {
        setConversations(data);
        if (data.length > 0) setActiveConv(data[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
    <div className="max-w-6xl">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 10rem)' }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <div className="w-80 border-r border-gray-100 flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 border-b border-gray-50">
                    <div className="w-11 h-11 rounded-full bg-gray-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No conversations yet.</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.otherUserId}
                    onClick={() => { setActiveConv(c); setInput(''); }}
                    className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      activeConv?.otherUserId === c.otherUserId ? 'bg-emerald-50 border-l-2 border-l-emerald-600' : ''
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {initials(c.otherUserName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-gray-900 truncate">{c.otherUserName}</span>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">{timeAgo(c.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-1">
                        {c.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat panel */}
          {activeConv ? (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold">
                    {initials(activeConv.otherUserName)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{activeConv.otherUserName}</div>
                    <div className="text-xs text-gray-400">{activeConv.otherUserRole}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((msg) => {
                  const isMe = msg.senderUserId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold mr-2 shrink-0 mt-1">
                          {initials(activeConv.otherUserName)}
                        </div>
                      )}
                      <div className={`max-w-[70%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe ? 'bg-emerald-700 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-xs text-gray-400 px-1">{timeAgo(msg.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                    className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="w-8 h-8 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 rounded-xl flex items-center justify-center transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-400">Select a conversation to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
