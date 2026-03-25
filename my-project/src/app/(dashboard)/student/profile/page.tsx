'use client';

import { useState } from 'react';
import { User, Home, Users, BookOpen, Lock, CheckCircle, Pencil, X } from 'lucide-react';
import { mockUser } from '@/lib/api/mockData';
import { logAction } from '@/lib/utils/auditLogger';

const tabs = [
  { id: 'personal',     label: 'Personal Info',   icon: User },
  { id: 'guardian',     label: 'Parent / Guardian', icon: Users },
  { id: 'socioeconomic',label: 'Background',       icon: Home },
  { id: 'academic',     label: 'Academic',         icon: BookOpen },
  { id: 'confidential', label: 'Mentor Notes',     icon: Lock },
];

// FR2.1 — personal data
const personalInit = {
  fullName:    mockUser.fullName,
  dob:         '2008-04-12',
  nationalId:  '1 2008 4 0000000 1 23',
  school:      mockUser.school,
  gradeLevel:  mockUser.gradeLevel,
  email:       mockUser.email,
  phone:       '+250 788 000 000',
};

// FR2.2 — parent/guardian
const guardianInit = {
  guardianName:         'Pierre Niyonzima',
  relationship:         'Father',
  guardianPhone:        '+250 788 111 222',
  guardianEmail:        'pierre@example.com',
};

// FR2.3 — socio-economic
const socioInit = {
  familyIncome:         'Below 50,000 RWF/month',
  parentOccupation:     'Farmer',
  householdSize:        '6',
  householdResponsibilities: 'Helps with younger siblings after school',
  livingConditions:     'Rural home, no electricity',
};

// FR2.4 — location
const locationInit = {
  homeAddress:  'Ruyenzi Sector, Kamonyi District',
  schoolAddress:'GS Ruyenzi, Kamonyi District, Southern Province',
  distanceKm:   '3',
};

// FR2.5 — confidential notes (read-only for student)
const mentorNotes = [
  { id: 'n1', author: 'Dr. Alice Ingabire', date: '2026-03-15', note: 'Jean Pierre shows strong motivation. Needs extra support with writing structure. Recommend weekly writing exercises.' },
  { id: 'n2', author: 'Mr. Robert Mugisha', date: '2026-03-10', note: 'Attended all sessions this month. Excellent progress in digital literacy. Ready for CV building module.' },
];

export default function StudentProfilePage() {
  const [activeTab, setActiveTab]   = useState('personal');
  const [editing, setEditing]       = useState(false);
  const [personal, setPersonal]     = useState(personalInit);
  const [guardian, setGuardian]     = useState(guardianInit);
  const [socio, setSocio]           = useState(socioInit);
  const [location, setLocation]     = useState(locationInit);
  const [saved, setSaved]           = useState(false);

  const initials = mockUser.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2);

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    logAction(mockUser.id, 'STUDENT', 'PROFILE_UPDATED', 'Student updated their profile');
    setTimeout(() => setSaved(false), 3000);
  };

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    type = 'text',
    readOnly = false
  ) => (
    <div key={label}>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {editing && !readOnly ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 bg-white"
        />
      ) : (
        <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-xl">{value || '—'}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
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
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900">{personal.fullName}</h2>
          <p className="text-sm text-gray-500">{personal.school} · {personal.gradeLevel}</p>
          <p className="text-xs text-gray-400 mt-0.5">{personal.email}</p>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-colors shrink-0 bg-emerald-700 hover:bg-emerald-800 text-white"
        >
          {editing ? <><CheckCircle className="w-4 h-4" /> Save</> : <><Pencil className="w-4 h-4" /> Edit Profile</>}
        </button>
        {editing && (
          <button
            onClick={() => setEditing(false)}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors"
          >
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
              activeTab === id
                ? 'bg-emerald-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">

        {/* FR2.1 Personal */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('Full Name',    personal.fullName,   (v) => setPersonal({ ...personal, fullName: v }))}
              {field('Date of Birth', personal.dob,       (v) => setPersonal({ ...personal, dob: v }), 'date')}
              {field('National ID',  personal.nationalId, (v) => setPersonal({ ...personal, nationalId: v }))}
              {field('School',       personal.school,     (v) => setPersonal({ ...personal, school: v }))}
              {field('Grade Level',  personal.gradeLevel, (v) => setPersonal({ ...personal, gradeLevel: v }))}
              {field('Email',        personal.email,      (v) => setPersonal({ ...personal, email: v }), 'email')}
              {field('Phone',        personal.phone,      (v) => setPersonal({ ...personal, phone: v }), 'tel')}
            </div>
          </div>
        )}

        {/* FR2.2 Guardian */}
        {activeTab === 'guardian' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Parent / Guardian Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('Guardian Full Name',  guardian.guardianName,  (v) => setGuardian({ ...guardian, guardianName: v }))}
              {field('Relationship',        guardian.relationship,  (v) => setGuardian({ ...guardian, relationship: v }))}
              {field('Phone Number',        guardian.guardianPhone, (v) => setGuardian({ ...guardian, guardianPhone: v }), 'tel')}
              {field('Email (optional)',    guardian.guardianEmail, (v) => setGuardian({ ...guardian, guardianEmail: v }), 'email')}
            </div>
          </div>
        )}

        {/* FR2.3 Socio-economic */}
        {activeTab === 'socioeconomic' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Socio-Economic Background</h3>
            <p className="text-xs text-gray-400 mb-4">This information is confidential and used only to provide better support.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('Monthly Family Income',       socio.familyIncome,              (v) => setSocio({ ...socio, familyIncome: v }))}
              {field('Parent / Guardian Occupation',socio.parentOccupation,          (v) => setSocio({ ...socio, parentOccupation: v }))}
              {field('Household Size',              socio.householdSize,             (v) => setSocio({ ...socio, householdSize: v }))}
              {field('Living Conditions',           socio.livingConditions,          (v) => setSocio({ ...socio, livingConditions: v }))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Household Responsibilities</label>
              {editing ? (
                <textarea
                  rows={3}
                  value={socio.householdResponsibilities}
                  onChange={(e) => setSocio({ ...socio, householdResponsibilities: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none"
                />
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-xl">{socio.householdResponsibilities}</p>
              )}
            </div>
          </div>
        )}

        {/* FR2.4 Location */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Location & Academic Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('Home Address',         location.homeAddress,   (v) => setLocation({ ...location, homeAddress: v }))}
              {field('School Address',       location.schoolAddress, (v) => setLocation({ ...location, schoolAddress: v }))}
              {field('Distance to School (km)', location.distanceKm,(v) => setLocation({ ...location, distanceKm: v }))}
            </div>
          </div>
        )}

        {/* FR2.5 Confidential notes — read-only for student */}
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
                {mentorNotes.map((n) => (
                  <div key={n.id} className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-amber-700">{n.author}</span>
                      <span className="text-xs text-gray-400">{new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{n.note}</p>
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
