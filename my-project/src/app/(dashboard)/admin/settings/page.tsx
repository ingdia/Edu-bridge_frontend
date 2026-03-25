'use client';

import { useState } from 'react';
import { Settings, Lock, School, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '@/lib/contexts/AuthContext';

const tabs = [
  { id: 'system',   label: 'System',   icon: Settings },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'school',   label: 'School',   icon: School },
];

export default function AdminSettingsPage() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('system');
  const [saved, setSaved]         = useState(false);

  // System settings
  const [platformName, setPlatformName]   = useState('EDU-Bridge');
  const [maintenanceMode, setMaintenance] = useState(false);
  const [registrationOpen, setRegOpen]    = useState(true);
  const [maxStudents, setMaxStudents]     = useState('200');

  // Security
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [pwError, setPwError]     = useState('');
  const [sessionTimeout, setSessionTimeout] = useState('60');

  // School config
  const [schoolName, setSchoolName]     = useState('GS Ruyenzi');
  const [province, setProvince]         = useState('Southern Province');
  const [district, setDistrict]         = useState('Kamonyi District');
  const [labCapacity, setLabCapacity]   = useState('40');
  const [labDays, setLabDays]           = useState('Tuesday, Thursday');

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    setPwError('');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    handleSave();
  };

  const field = (label: string, value: string, onChange: (v: string) => void, type = 'text') => (
    <div key={label}>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user?.email ?? 'admin@edubridge.rw'}</p>
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

        {activeTab === 'system' && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Platform Configuration</h2>
            <div className="space-y-4 max-w-sm">
              {field('Platform Name', platformName, setPlatformName)}
              {field('Max Students', maxStudents, setMaxStudents, 'number')}
            </div>
            <div className="space-y-3 pt-2">
              {[
                { label: 'Open Registration',  desc: 'Allow new students and mentors to register', value: registrationOpen, set: setRegOpen },
                { label: 'Maintenance Mode',   desc: 'Temporarily disable access for all users',   value: maintenanceMode, set: setMaintenance },
              ].map(({ label, desc, value, set }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                  <button onClick={() => set(!value)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-emerald-600' : 'bg-gray-200'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
              Save Settings
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">Security Settings</h2>
            <div className="max-w-xs">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Session timeout (minutes)</label>
              <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white">
                {['30', '60', '120', '240'].map((v) => <option key={v} value={v}>{v} minutes</option>)}
              </select>
            </div>
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Change Admin Password</h3>
              {pwError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl mb-4">{pwError}</p>}
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
          </div>
        )}

        {activeTab === 'school' && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-gray-900">School Configuration</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('School Name',    schoolName,   setSchoolName)}
              {field('Province',       province,     setProvince)}
              {field('District',       district,     setDistrict)}
              {field('Lab Capacity',   labCapacity,  setLabCapacity, 'number')}
              {field('Lab Session Days', labDays,    setLabDays)}
            </div>
            <button onClick={handleSave} className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
              Save School Info
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
