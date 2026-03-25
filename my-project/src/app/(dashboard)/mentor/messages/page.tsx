'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const conversations = [
  {
    id: 'usr_123',
    name: 'Jean Pierre Niyonzima',
    lastMessage: 'Thank you for the feedback!',
    time: '10:32 AM',
    unread: 2,
    messages: [
      { id: 1, from: 'them', text: 'Good morning! I finished the listening exercise.', time: '10:15 AM' },
      { id: 2, from: 'me',   text: 'Great work Jean Pierre! I will review it today.', time: '10:20 AM' },
      { id: 3, from: 'them', text: 'Thank you for the feedback!', time: '10:32 AM' },
    ],
  },
  {
    id: 'usr_124',
    name: 'Marie Uwimana',
    lastMessage: 'Can we reschedule our session?',
    time: 'Yesterday',
    unread: 0,
    messages: [
      { id: 1, from: 'them', text: 'Hello! Can we reschedule our session?', time: 'Yesterday' },
      { id: 2, from: 'me',   text: 'Sure, what time works for you?', time: 'Yesterday' },
    ],
  },
  {
    id: 'usr_125',
    name: 'Emmanuel Habimana',
    lastMessage: 'I need help with the writing module.',
    time: 'Mon',
    unread: 1,
    messages: [
      { id: 1, from: 'them', text: 'I need help with the writing module.', time: 'Mon' },
    ],
  },
];

export default function MentorMessages() {
  const [active, setActive] = useState(conversations[0]);
  const [msgs, setMsgs] = useState(conversations[0].messages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const selectConvo = (c: typeof conversations[0]) => {
    setActive(c);
    setMsgs(c.messages);
    setInput('');
  };

  const send = () => {
    if (!input.trim()) return;
    setMsgs((prev) => [...prev, { id: Date.now(), from: 'me', text: input.trim(), time: 'Now' }]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversation List */}
      <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h1 className="text-sm font-semibold text-gray-900">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => selectConvo(c)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                active.id === c.id ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 truncate">{c.name}</span>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-1">{c.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
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

      {/* Chat Window */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">
            {active.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{active.name}</p>
            <p className="text-xs text-gray-400">Student</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {msgs.map((m) => (
            <div key={m.id} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-xs px-4 py-2.5 rounded-2xl text-sm',
                m.from === 'me'
                  ? 'bg-emerald-700 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              )}>
                <p>{m.text}</p>
                <p className={cn('text-[10px] mt-1', m.from === 'me' ? 'text-emerald-200' : 'text-gray-400')}>
                  {m.time}
                </p>
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
            className="w-9 h-9 bg-emerald-700 rounded-xl flex items-center justify-center text-white hover:bg-emerald-800 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
