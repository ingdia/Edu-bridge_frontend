'use client';

import { useEffect, useState, useCallback } from 'react';
import { User, Home, Users, BookOpen, Lock, CheckCircle, Pencil, X } from 'lucide-react';
import { useAuthContext } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

const tabs = [
  { id: 'personal',      label: 'Personal Info',    icon: User },
  { id: 'guardian',      label: 'Parent / Guardian', icon: Users },
  { id: 'socioeconomic', label: 'Background',        icon: Home },
  { id: 'academic',      label: 'Academic',          icon: BookOpen },
  { id: 'confidential',  label: 'Mentor Notes',      icon: Lock },
];

export default function StudentProfilePage() {
  const { user } = useAuthContext();
  const [profile, setProfile]   = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState<any>({});
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: { profile: any } }>('/api/profile/me');
      const p = res.data.profile;
      setProfile(p);
      setForm({
        fullName:                  p.fullName ?? '',
        dateOfBirth:               p.dateOfBirth?.split('T')[0] ?? '',
        nationalId:                p.nationalId ?? '',
        schoolName:                p.schoolName ?? '',
        gradeLevel:                p.gradeLevel ?? '',
        phoneNumber:               p.phoneNumber ?? '',
        guardianName:              p.guardianName ?? '',
        guardianRelationship:      p.guardianRelationship ?? '',
        guardianPhone:             p.guardianPhone ?? '',
        guardianEmail:             p.guardianEmail ?? '',
        familyIncome:              p.familyIncome ?? '',
        parentOccupation:          p.parentOccupation ?? '',
        householdSize:             p.householdSize ? String(p.householdSize) : '',
        livingConditions:          p.livingConditions ?? '',
        householdResponsibilities: p.householdResponsibilities ?? '',
        homeAddress:               p.homeAddress ?? '',
        schoolAddress:             p.schoolAddress ?? '',
        distanceToSchool:          p.distanceToSchool ? String(p.distanceToSchool) : '',
      });
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiFetch('/api/profile/me', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: string, type = 'text', readOnly = false) => (
    <div key={key}>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {editing && !readOnly ? (
        <input
          type={type}
          value={form[key] ?? ''}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-xl">{form[key] || '—'}</p>
      )}
    </div>
  );

  const displayName = user?.fullName || user?.email?.split('@')[0] || 'Student';
  const avatarInitials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const mentorNotes: any[] = profile?.mentorNotes ?? [];

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl">
        <div className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your personal, family, and academic information.</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl">
            <CheckCircle className="w-4 h-4" /> Profile saved successfully
          </div>
        )}
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-700 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900">{form.fullName || displayName}</h2>
          <p className="text-sm text-gray-500">{form.schoolName || '—'} · {form.gradeLevel || '—'}</p>
          <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white disabled:bg-gray-200"
        >
          {editing
            ? saving ? 'Saving…' : <><CheckCircle className="w-4 h-4" /> Save</>
            : <><Pencil className="w-4 h-4" /> Edit Profile</>
          }
        </button>
        {editing && (
          <button onClick={() => setEditing(false)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === id ? 'bg-emerald-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('Full Name',     'fullName')}
              {field('Date of Birth', 'dateOfBirth', 'date')}
              {field('National ID',   'nationalId')}
              {field('School',        'schoolName')}
              {field('Grade Level',   'gradeLevel')}
              {field('Phone',         'phoneNumber', 'tel')}
            </div>
          </div>
        )}

        {activeTab === 'guardian' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Parent / Guardian Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('Guardian Full Name', 'guardianName')}
              {field('Relationship',       'guardianRelationship')}
              {field('Phone Number',       'guardianPhone', 'tel')}
              {field('Email (optional)',   'guardianEmail', 'email')}
            </div>
          </div>
        )}

        {activeTab === 'socioeconomic' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Socio-Economic Background</h3>
            <p className="text-xs text-gray-400 mb-4">This information is confidential and used only to provide better support.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('Monthly Family Income',        'familyIncome')}
              {field('Parent / Guardian Occupation', 'parentOccupation')}
              {field('Household Size',               'householdSize')}
              {field('Living Conditions',            'livingConditions')}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Household Responsibilities</label>
              {editing ? (
                <textarea
                  rows={3}
                  value={form.householdResponsibilities ?? ''}
                  onChange={(e) => setForm({ ...form, householdResponsibilities: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none"
                />
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-xl">{form.householdResponsibilities || '—'}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Location & Academic Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('Home Address',            'homeAddress')}
              {field('School Address',          'schoolAddress')}
              {field('Distance to School (km)', 'distanceToSchool')}
            </div>
          </div>
        )}

        {activeTab === 'confidential' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-gray-900">Mentor Notes</h3>
              <span className="text-xs text-gray-400 ml-auto">Visible to you, your mentor, and admin only</span>
            </div>
            {mentorNotes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No notes yet from your mentor.</p>
            ) : (
              <div className="space-y-3">
                {mentorNotes.map((n: any, i: number) => (
                  <div key={i} className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-amber-700">{n.author ?? 'Mentor'}</span>
                      <span className="text-xs text-gray-400">
                        {n.date ? new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{n.note ?? n.text ?? n}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
