'use client';

import { useState } from 'react';
import { Bell, Lock, CalendarDays, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '@/lib/contexts/AuthContext';

const tabs = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',      label: 'Security',       icon: Lock },
  { id: 'availability',  label: 'Availability',   icon: CalendarDays },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function MentorSettingsPage() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('notifications');
  const [saved, setSaved]         = useState(false);

  const [notifs, setNotifs] = useState({
    sessionReminders:   true,
    studentSubmissions: true,
    platformUpdates:    false,
  });

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [pwError, setPwError]     = useState('');

  const [availability, setAvailability] = useState<Record<string, boolean>>(
    Object.fromEntries(days.map((d) => [d, d === 'Tuesday' || d === 'Thursday']))
  );
  const [sessionDuration, setSessionDuration] = useState('60');

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    setPwError('');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    handleSave();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email ?? 'mentor@edubridge.rw'}</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
            <CheckCircle className="w-4 h-4" /> Saved successfully
          </div>
        )}
      </div>

      <div className="flex gap-1 flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === id ? 'bg-emerald-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
            }`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">

        {activeTab === 'notifications' && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Notification Preferences</h2>
            {[
              { key: 'sessionReminders' as const,   label: 'Session reminders',      desc: 'Reminders before scheduled mentorship sessions' },
              { key: 'studentSubmissions' as const,  label: 'Student submissions',    desc: 'When a student submits an exercise for grading' },
              { key: 'platformUpdates' as const,     label: 'Platform updates',       desc: 'News about new features and modules' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => setNotifs((p) => ({ ...p, [key]: !p[key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifs[key] ? 'bg-emerald-600' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifs[key] ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
              Save Preferences
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
            {pwError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{pwError}</p>}
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              {[
                { label: 'Current password', value: currentPw, onChange: setCurrentPw },
                { label: 'New password',     value: newPw,     onChange: setNewPw },
                { label: 'Confirm password', value: confirmPw, onChange: setConfirmPw },
              ].map(({ label, value, onChange }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} required
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Weekly Availability</h2>
            <p className="text-xs text-gray-400">Select the days you are available for lab sessions.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {days.map((day) => (
                <button key={day} onClick={() => setAvailability((p) => ({ ...p, [day]: !p[day] }))}
                  className={`py-2.5 text-sm font-semibold rounded-xl border-2 transition-all ${
                    availability[day] ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  {day}
                </button>
              ))}
            </div>
            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Default session duration</label>
              <select value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white">
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
              Save Availability
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
