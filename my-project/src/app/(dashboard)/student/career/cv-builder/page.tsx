'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Plus, Trash2, Download, Eye } from 'lucide-react';
import { mockUser } from '@/lib/api/mockData';
import { logAction } from '@/lib/utils/auditLogger';

const steps = ['Personal Info', 'Education', 'Skills', 'Experience', 'References'];

type Skill = { id: string; name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' };
type Education = { id: string; school: string; level: string; year: string; grade: string };
type Experience = { id: string; title: string; org: string; period: string; description: string };
type Reference = { id: string; name: string; role: string; contact: string };

export default function CVBuilderPage() {
  const [step, setStep]     = useState(0);
  const [saved, setSaved]   = useState(false);
  const [preview, setPreview] = useState(false);

  // Personal info
  const [personal, setPersonal] = useState({
    fullName:  mockUser.fullName,
    email:     mockUser.email,
    phone:     '+250 788 000 000',
    address:   'Ruyenzi Sector, Kamonyi District',
    school:    mockUser.school,
    grade:     mockUser.gradeLevel,
    summary:   '',
  });

  // Education
  const [education, setEducation] = useState<Education[]>([
    { id: 'edu_1', school: mockUser.school, level: 'Senior Secondary', year: '2026', grade: '85%' },
  ]);

  // Skills
  const [skills, setSkills] = useState<Skill[]>([
    { id: 'sk_1', name: 'English Communication', level: 'Intermediate' },
    { id: 'sk_2', name: 'Microsoft Word',         level: 'Beginner' },
    { id: 'sk_3', name: 'Email Writing',          level: 'Intermediate' },
  ]);
  const [newSkill, setNewSkill] = useState('');

  // Experience
  const [experience, setExperience] = useState<Experience[]>([]);

  // References
  const [references, setReferences] = useState<Reference[]>([
    { id: 'ref_1', name: 'Dr. Alice Ingabire', role: 'Mentor, EDU-Bridge', contact: 'alice@edubridge.rw' },
  ]);

  const handleSave = () => {
    setSaved(true);
    logAction(mockUser.id, 'STUDENT', 'CV_SAVED', 'Student saved CV draft');
    setTimeout(() => setSaved(false), 3000);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setSkills((p) => [...p, { id: `sk_${Date.now()}`, name: newSkill.trim(), level: 'Beginner' }]);
    setNewSkill('');
  };

  const addEducation = () =>
    setEducation((p) => [...p, { id: `edu_${Date.now()}`, school: '', level: '', year: '', grade: '' }]);

  const addExperience = () =>
    setExperience((p) => [...p, { id: `exp_${Date.now()}`, title: '', org: '', period: '', description: '' }]);

  const addReference = () =>
    setReferences((p) => [...p, { id: `ref_${Date.now()}`, name: '', role: '', contact: '' }]);

  const completedSteps = [
    personal.fullName && personal.email,
    education.length > 0,
    skills.length > 0,
    true, // experience optional
    references.length > 0,
  ];

  const overallPct = Math.round((completedSteps.filter(Boolean).length / steps.length) * 100);

  if (preview) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setPreview(false)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" /> Back to Editor
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {/* CV Preview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h1 className="text-2xl font-bold text-gray-900">{personal.fullName}</h1>
            <p className="text-sm text-gray-500 mt-1">{personal.school} · {personal.grade}</p>
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
              <span>{personal.email}</span>
              <span>{personal.phone}</span>
              <span>{personal.address}</span>
            </div>
          </div>
          {personal.summary && (
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Summary</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{personal.summary}</p>
            </div>
          )}
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Education</h2>
            {education.map((e) => (
              <div key={e.id} className="mb-2">
                <p className="text-sm font-semibold text-gray-900">{e.school}</p>
                <p className="text-xs text-gray-500">{e.level} · {e.year} · Grade: {e.grade}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s.id} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">
                  {s.name} · {s.level}
                </span>
              ))}
            </div>
          </div>
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Experience</h2>
              {experience.map((e) => (
                <div key={e.id} className="mb-3">
                  <p className="text-sm font-semibold text-gray-900">{e.title} — {e.org}</p>
                  <p className="text-xs text-gray-400">{e.period}</p>
                  <p className="text-xs text-gray-600 mt-1">{e.description}</p>
                </div>
              ))}
            </div>
          )}
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">References</h2>
            {references.map((r) => (
              <div key={r.id} className="mb-2">
                <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                <p className="text-xs text-gray-500">{r.role} · {r.contact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/student/career" className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CV Builder</h1>
            <p className="text-sm text-gray-500">{overallPct}% complete</p>
          </div>
        </div>
        <div className="flex gap-2">
          {saved && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
              <CheckCircle className="w-4 h-4" /> Saved
            </div>
          )}
          <button onClick={() => setPreview(true)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
            Save Draft
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${overallPct}%` }} />
      </div>

      {/* Step tabs */}
      <div className="flex gap-1 flex-wrap">
        {steps.map((s, i) => (
          <button key={s} onClick={() => setStep(i)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
              step === i ? 'bg-emerald-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
            }`}>
            {completedSteps[i] && <CheckCircle className="w-3 h-3" />}
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">

        {/* Step 0 — Personal Info */}
        {step === 0 && (
          <>
            <h2 className="text-sm font-semibold text-gray-900">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                ['Full Name',    'fullName', 'text'],
                ['Email',        'email',    'email'],
                ['Phone',        'phone',    'tel'],
                ['Address',      'address',  'text'],
                ['School',       'school',   'text'],
                ['Grade Level',  'grade',    'text'],
              ] as [string, keyof typeof personal, string][]).map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                  <input type={type} value={personal[key]} onChange={(e) => setPersonal({ ...personal, [key]: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Professional Summary (optional)</label>
                <textarea rows={3} value={personal.summary} onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                  placeholder="A brief statement about your goals and strengths..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none" />
              </div>
            </div>
          </>
        )}

        {/* Step 1 — Education */}
        {step === 1 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Education</h2>
              <button onClick={addEducation} className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:text-emerald-800">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {education.map((e, i) => (
              <div key={e.id} className="p-4 border border-gray-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">Entry {i + 1}</span>
                  <button onClick={() => setEducation((p) => p.filter((x) => x.id !== e.id))} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {([['School Name', 'school'], ['Level', 'level'], ['Year', 'year'], ['Grade/Score', 'grade']] as [string, keyof Education][]).map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                      <input value={e[key]} onChange={(ev) => setEducation((p) => p.map((x) => x.id === e.id ? { ...x, [key]: ev.target.value } : x))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Step 2 — Skills */}
        {step === 2 && (
          <>
            <h2 className="text-sm font-semibold text-gray-900">Skills</h2>
            <div className="flex gap-2">
              <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill (e.g. English Writing)"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
              <button onClick={addSkill} className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {skills.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-900 flex-1">{s.name}</span>
                  <select value={s.level} onChange={(e) => setSkills((p) => p.map((x) => x.id === s.id ? { ...x, level: e.target.value as Skill['level'] } : x))}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400">
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                  <button onClick={() => setSkills((p) => p.filter((x) => x.id !== s.id))} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 3 — Experience */}
        {step === 3 && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Experience</h2>
                <p className="text-xs text-gray-400 mt-0.5">Optional — include internships, volunteer work, or school activities</p>
              </div>
              <button onClick={addExperience} className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:text-emerald-800">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {experience.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">No experience added yet. Click Add to get started.</p>
            )}
            {experience.map((e, i) => (
              <div key={e.id} className="p-4 border border-gray-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">Entry {i + 1}</span>
                  <button onClick={() => setExperience((p) => p.filter((x) => x.id !== e.id))} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {([['Role / Title', 'title'], ['Organisation', 'org'], ['Period', 'period']] as [string, keyof Experience][]).map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                      <input value={e[key]} onChange={(ev) => setExperience((p) => p.map((x) => x.id === e.id ? { ...x, [key]: ev.target.value } : x))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                    <textarea rows={2} value={e.description} onChange={(ev) => setExperience((p) => p.map((x) => x.id === e.id ? { ...x, description: ev.target.value } : x))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none" />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Step 4 — References */}
        {step === 4 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">References</h2>
              <button onClick={addReference} className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold hover:text-emerald-800">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            {references.map((r, i) => (
              <div key={r.id} className="p-4 border border-gray-100 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">Reference {i + 1}</span>
                  <button onClick={() => setReferences((p) => p.filter((x) => x.id !== r.id))} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {([['Full Name', 'name'], ['Role', 'role'], ['Contact', 'contact']] as [string, keyof Reference][]).map(([label, key]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                      <input value={r[key]} onChange={(e) => setReferences((p) => p.map((x) => x.id === r.id ? { ...x, [key]: e.target.value } : x))}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <button onClick={() => setStep((p) => Math.max(0, p - 1))} disabled={step === 0}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-xl transition-colors">
            Previous
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep((p) => p + 1)}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors">
              Next
            </button>
          ) : (
            <button onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors">
              <CheckCircle className="w-4 h-4" /> Save CV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
