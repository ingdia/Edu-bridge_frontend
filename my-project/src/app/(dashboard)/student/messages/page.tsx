'use client';

import { useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react';

const conversations = [
  {
    id: 'conv_1',
    name: 'Mr. David Mugisha',
    role: 'English Mentor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    lastMessage: 'Great work on your listening exercise! Let\'s review your writing next session.',
    time: '10:32 AM',
    unread: 2,
    online: true,
    messages: [
      { id: 1, from: 'them', text: 'Hello! How are you getting on with the English modules?', time: '9:00 AM' },
      { id: 2, from: 'me', text: 'Hi Mr. Mugisha! I finished the listening exercise. It was challenging but I scored 85%.', time: '9:15 AM' },
      { id: 3, from: 'them', text: 'That\'s excellent! 85% is a great score for that exercise.', time: '9:20 AM' },
      { id: 4, from: 'me', text: 'Thank you! I\'m struggling a bit with the writing tasks though.', time: '9:45 AM' },
      { id: 5, from: 'them', text: 'Great work on your listening exercise! Let\'s review your writing next session.', time: '10:32 AM' },
    ],
  },
  {
    id: 'conv_2',
    name: 'Ms. Aline Uwase',
    role: 'Career Advisor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    lastMessage: 'I\'ve reviewed your CV draft. A few suggestions to share.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: 'them', text: 'Hi! I saw you started the CV builder. How is it going?', time: 'Yesterday 2:00 PM' },
      { id: 2, from: 'me', text: 'I\'ve filled in my personal info and education sections.', time: 'Yesterday 2:30 PM' },
      { id: 3, from: 'them', text: 'I\'ve reviewed your CV draft. A few suggestions to share.', time: 'Yesterday 4:00 PM' },
    ],
  },
  {
    id: 'conv_3',
    name: 'EDU-Bridge Support',
    role: 'Platform Support',
    avatar: null,
    lastMessage: 'Welcome to EDU-Bridge! Let us know if you need any help.',
    time: 'Mar 10',
    unread: 0,
    online: true,
    messages: [
      { id: 1, from: 'them', text: 'Welcome to EDU-Bridge! Let us know if you need any help.', time: 'Mar 10' },
    ],
  },
];

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(conversations[0].id);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  const conv = conversations.find((c) => c.id === activeConv)!;
  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name: string) => name.split(' ').map((n) => n[0]).join('').slice(0, 2);

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
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConv(c.id)}
                  className={`w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                    activeConv === c.id ? 'bg-emerald-50 border-l-2 border-l-emerald-600' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold">
                        {initials(c.name)}
                      </div>
                    )}
                    {c.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold text-gray-900 truncate">{c.name}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">{c.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-1">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat panel */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Chat header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {conv.avatar ? (
                    <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold">
                      {initials(conv.name)}
                    </div>
                  )}
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{conv.name}</div>
                  <div className="text-xs text-gray-400">{conv.online ? 'Online' : 'Offline'} · {conv.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {conv.messages.map((msg) => {
                const isMe = msg.from === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold mr-2 shrink-0 mt-1">
                        {initials(conv.name)}
                      </div>
                    )}
                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-emerald-700 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-400 px-1">{msg.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) setInput(''); }}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button
                  onClick={() => setInput('')}
                  disabled={!input.trim()}
                  className="w-8 h-8 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-200 rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
