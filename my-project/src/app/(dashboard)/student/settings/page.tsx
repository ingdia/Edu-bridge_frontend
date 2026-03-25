'use client';

import { useState } from 'react';
import { Bell, Lock, Globe, Monitor, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { mockUser } from '@/lib/api/mockData';

const tabs = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security',      label: 'Security',       icon: Lock },
  { id: 'preferences',   label: 'Preferences',    icon: Monitor },
];

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [saved, setSaved]         = useState(false);

  // Notification prefs
  const [notifs, setNotifs] = useState({
    sessionReminders:  true,
    newFeedback:       true,
    deadlineAlerts:    true,
    platformUpdates:   false,
  });

  // Security
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [pwError, setPwError]       = useState('');

  // Preferences
  const [language, setLanguage]     = useState('English');
  const [theme, setTheme]           = useState('light');
  const [fontSize, setFontSize]     = useState('medium');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    setPwError('');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    handleSave();
  };

  const toggle = (key: keyof typeof notifs) =>
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{mockUser.email}</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
            <CheckCircle className="w-4 h-4" /> Saved successfully
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === id
                ? 'bg-emerald-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Notification Preferences</h2>
            {[
              { key: 'sessionReminders' as const,  label: 'Session reminders',   desc: 'Get notified before upcoming mentorship sessions' },
              { key: 'newFeedback' as const,        label: 'New feedback',         desc: 'When a mentor leaves feedback on your exercises' },
              { key: 'deadlineAlerts' as const,     label: 'Deadline alerts',      desc: 'Reminders for scholarship and application deadlines' },
              { key: 'platformUpdates' as const,    label: 'Platform updates',     desc: 'News about new modules and features' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => toggle(key)}
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

        {/* Security */}
        {activeTab === 'security' && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Change Password</h2>
            {pwError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{pwError}</p>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              {[
                { label: 'Current password', value: currentPw, onChange: setCurrentPw },
                { label: 'New password',     value: newPw,     onChange: setNewPw },
                { label: 'Confirm password', value: confirmPw, onChange: setConfirmPw },
              ].map(({ label, value, onChange }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      required
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                    />
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

        {/* Preferences */}
        {activeTab === 'preferences' && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Display Preferences</h2>
            <div className="space-y-4 max-w-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  <Globe className="w-3.5 h-3.5 inline mr-1" />Language
                </label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white">
                  <option>English</option>
                  <option>Kinyarwanda</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Theme</label>
                <div className="flex gap-2">
                  {['light', 'dark'].map((t) => (
                    <button key={t} onClick={() => setTheme(t)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border-2 capitalize transition-all ${
                        theme === t ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Font Size</label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((s) => (
                    <button key={s} onClick={() => setFontSize(s)}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border-2 capitalize transition-all ${
                        fontSize === s ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
