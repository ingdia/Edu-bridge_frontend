'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logAction } from '@/lib/utils/auditLogger';

type Message = { id: number; from: 'me' | 'them'; text: string; time: string };

const initialConversations = [
  {
    id: 'usr_123',
    name: 'Jean Pierre Niyonzima',
    role: 'Student · Senior 4',
    online: true,
    lastMessage: 'Thank you for the feedback!',
    time: '10:32 AM',
    unread: 2,
    messages: [
      { id: 1, from: 'them' as const, text: 'Good morning! I finished the listening exercise.', time: '10:15 AM' },
      { id: 2, from: 'me'   as const, text: 'Great work Jean Pierre! I will review it today.', time: '10:20 AM' },
      { id: 3, from: 'them' as const, text: 'Thank you for the feedback!', time: '10:32 AM' },
    ],
  },
  {
    id: 'usr_124',
    name: 'Marie Uwimana',
    role: 'Student · Senior 4',
    online: false,
    lastMessage: 'Can we reschedule our session?',
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, from: 'them' as const, text: 'Hello! Can we reschedule our session?', time: 'Yesterday' },
      { id: 2, from: 'me'   as const, text: 'Sure, what time works for you?', time: 'Yesterday' },
    ],
  },
  {
    id: 'usr_125',
    name: 'Emmanuel Habimana',
    role: 'Student · Senior 4',
    online: true,
    lastMessage: 'I need help with the writing module.',
    time: 'Mon',
    unread: 1,
    messages: [
      { id: 1, from: 'them' as const, text: 'I need help with the writing module.', time: 'Mon' },
    ],
  },
];

export default function MentorMessages() {
  const [activeId, setActiveId]     = useState('usr_123');
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(
    Object.fromEntries(initialConversations.map((c) => [c.id, c.messages]))
  );
  const [input, setInput]   = useState('');
  const [search, setSearch] = useState('');
  const bottomRef           = useRef<HTMLDivElement>(null);

  const conv     = initialConversations.find((c) => c.id === activeId)!;
  const messages = allMessages[activeId] ?? [];
  const filtered = initialConversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const msg: Message = { id: Date.now(), from: 'me', text: input.trim(), time: now };
    setAllMessages((prev) => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }));
    logAction('mnt_001', 'MENTOR', 'MESSAGE_SENT', `Message sent to student ${activeId}`);
    setInput('');
  };

  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2);

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
              placeholder="Search students..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => { setActiveId(c.id); setInput(''); }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                activeId === c.id ? 'bg-emerald-50 border-l-2 border-l-emerald-600' : ''
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">
                  {initials(c.name)}
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 truncate">{c.name}</span>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-1">{c.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {allMessages[c.id]?.at(-1)?.text ?? c.lastMessage}
                </p>
              </div>
              {c.unread > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">
              {initials(conv.name)}
            </div>
            {conv.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{conv.name}</p>
            <p className="text-xs text-gray-400">{conv.online ? 'Online' : 'Offline'} · {conv.role}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
              {m.from === 'them' && (
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold mr-2 shrink-0 mt-1">
                  {initials(conv.name)}
                </div>
              )}
              <div className={cn('max-w-xs flex flex-col gap-1', m.from === 'me' ? 'items-end' : 'items-start')}>
                <div className={cn(
                  'px-4 py-2.5 rounded-2xl text-sm',
                  m.from === 'me'
                    ? 'bg-emerald-700 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                )}>
                  {m.text}
                </div>
                <span className="text-[10px] text-gray-400 px-1">{m.time}</span>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center text-white hover:bg-emerald-800 disabled:bg-gray-200 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
