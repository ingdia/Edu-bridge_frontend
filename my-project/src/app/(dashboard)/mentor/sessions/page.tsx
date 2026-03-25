'use client';

import { useState } from 'react';
import { CalendarDays, Clock, Users, Video, Plus } from 'lucide-react';
import { mockSessions } from '@/lib/api/mockData';
import type { Session } from '@/lib/types/api';

const pastSessions: Session[] = [
  { id: 'ses_p1', title: 'English Speaking Practice', description: 'Focused speaking practice session.', startTime: '2026-03-10T14:00:00Z', endTime: '2026-03-10T15:00:00Z', mentorId: 'mnt_001', studentIds: ['usr_123'], status: 'COMPLETED' },
  { id: 'ses_p2', title: 'CV Writing Workshop', description: 'Group session on CV and cover letter writing.', startTime: '2026-03-05T10:00:00Z', endTime: '2026-03-05T11:30:00Z', mentorId: 'mnt_001', studentIds: ['usr_123', 'usr_124', 'usr_125'], status: 'COMPLETED' },
];

const tabs = ['Upcoming', 'Past'];

export default function MentorSessions() {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [showForm, setShowForm] = useState(false);

  const sessions = activeTab === 'Upcoming' ? mockSessions : pastSessions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Sessions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your mentorship sessions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Session
        </button>
      </div>

      {/* New Session Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Schedule New Session</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Session Title</label>
              <input className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" placeholder="e.g. Weekly English Practice" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Students</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400">
                <option>Jean Pierre Niyonzima</option>
                <option>Marie Uwimana</option>
                <option>Emmanuel Habimana</option>
                <option>All Students</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Date & Time</label>
              <input type="datetime-local" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Duration</label>
              <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>1.5 hours</option>
                <option>2 hours</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-600 mb-1 block">Meeting Link (optional)</label>
              <input className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" placeholder="https://meet.google.com/..." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-emerald-700 text-white text-sm font-medium rounded-xl hover:bg-emerald-800 transition-colors">
              Schedule Session
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-emerald-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{s.title}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  s.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {s.status}
                </span>
              </div>
              {s.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.description}</p>}
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(s.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ·{' '}
                  {new Date(s.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3.5 h-3.5" /> {s.studentIds.length} student{s.studentIds.length > 1 ? 's' : ''}
                </span>
                {'meetingLink' in s && s.meetingLink && (
                  <a href={s.meetingLink} className="flex items-center gap-1 text-xs text-emerald-700 hover:underline">
                    <Video className="w-3.5 h-3.5" /> Join Meeting
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
