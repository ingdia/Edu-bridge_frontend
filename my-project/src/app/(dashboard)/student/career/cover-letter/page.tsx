'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Download } from 'lucide-react';
import { mockUser } from '@/lib/api/mockData';
import { logAction } from '@/lib/utils/auditLogger';

const templates = [
  { id: 'scholarship', label: 'Scholarship Application' },
  { id: 'internship',  label: 'Internship Application' },
  { id: 'job',         label: 'Job Application' },
];

const templateBodies: Record<string, string> = {
  scholarship: `Dear Scholarship Committee,\n\nI am writing to apply for the [Scholarship Name] offered by [Organisation]. I am currently a [Grade Level] student at [School Name], and I am passionate about [your field of interest].\n\nDuring my studies, I have [mention an achievement or skill]. I believe this scholarship will help me [explain how it supports your goals].\n\nI am committed to making the most of this opportunity and giving back to my community. I would be honoured to be considered for this award.\n\nThank you for your time and consideration.\n\nYours sincerely,\n[Your Name]`,
  internship: `Dear Hiring Manager,\n\nI am writing to express my interest in the [Internship Title] position at [Organisation]. I am a [Grade Level] student at [School Name] with a strong interest in [relevant field].\n\nThrough my studies and the EDU-Bridge platform, I have developed skills in [mention skills]. I am eager to apply these skills in a real-world environment and learn from your team.\n\nI am available [mention availability] and am highly motivated to contribute to your organisation.\n\nThank you for considering my application.\n\nYours sincerely,\n[Your Name]`,
  job: `Dear Hiring Manager,\n\nI am writing to apply for the [Job Title] position advertised by [Organisation]. I am a [Grade Level] student at [School Name] with experience in [relevant skills or activities].\n\nI am a hardworking and dedicated individual who is eager to contribute to your team. I have [mention a relevant skill or achievement] and I am confident that I can bring value to your organisation.\n\nI look forward to the opportunity to discuss my application further.\n\nYours sincerely,\n[Your Name]`,
};

export default function CoverLetterPage() {
  const [template, setTemplate]   = useState('scholarship');
  const [preview, setPreview]     = useState(false);
  const [saved, setSaved]         = useState(false);

  const [form, setForm] = useState({
    senderName:    mockUser.fullName,
    senderAddress: 'Ruyenzi Sector, Kamonyi District',
    senderEmail:   mockUser.email,
    senderPhone:   '+250 788 000 000',
    recipientName: '',
    recipientOrg:  '',
    date:          new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    subject:       '',
    body:          templateBodies['scholarship'],
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const applyTemplate = (t: string) => {
    setTemplate(t);
    setForm((p) => ({ ...p, body: templateBodies[t] }));
  };

  const handleSave = () => {
    setSaved(true);
    logAction(mockUser.id, 'STUDENT', 'CV_SAVED', 'Student saved cover letter draft');
    setTimeout(() => setSaved(false), 3000);
  };

  const field = (label: string, key: keyof typeof form, multiline = false) => (
    <div key={key}>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {multiline ? (
        <textarea
          rows={10}
          value={form[key]}
          onChange={(e) => set(key, e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 resize-none font-mono"
        />
      ) : (
        <input
          type="text"
          value={form[key]}
          onChange={(e) => set(key, e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/student/career" className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Cover Letter Builder</h1>
            <p className="text-sm text-gray-500">Write a professional cover letter for your application.</p>
          </div>
        </div>
        <div className="flex gap-2">
          {saved && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
              <CheckCircle className="w-4 h-4" /> Saved
            </div>
          )}
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Save Draft
          </button>
        </div>
      </div>

      {/* Template selector */}
      <div className="flex gap-2 flex-wrap">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => applyTemplate(t.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all ${
              template === t.id
                ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {preview ? (
        /* ── PREVIEW ── */
        <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4 text-sm text-gray-800 leading-relaxed">
          <div className="text-right space-y-0.5">
            <p className="font-semibold">{form.senderName}</p>
            <p className="text-gray-500">{form.senderAddress}</p>
            <p className="text-gray-500">{form.senderEmail} · {form.senderPhone}</p>
            <p className="text-gray-500 mt-2">{form.date}</p>
          </div>
          {form.recipientName && (
            <div className="space-y-0.5">
              <p className="font-semibold">{form.recipientName}</p>
              <p className="text-gray-500">{form.recipientOrg}</p>
            </div>
          )}
          {form.subject && (
            <p className="font-semibold underline">Re: {form.subject}</p>
          )}
          <div className="whitespace-pre-wrap">{form.body}</div>
          <div className="pt-4 flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      ) : (
        /* ── EDITOR ── */
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Your Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {field('Full Name',    'senderName')}
            {field('Email',        'senderEmail')}
            {field('Phone',        'senderPhone')}
            {field('Address',      'senderAddress')}
            {field('Date',         'date')}
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Recipient</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('Recipient Name / Title', 'recipientName')}
              {field('Organisation',           'recipientOrg')}
              {field('Subject / Re:',          'subject')}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Letter Body</h2>
            <p className="text-xs text-gray-400 mb-2">Replace the placeholders in [brackets] with your own information.</p>
            {field('', 'body', true)}
          </div>
        </div>
      )}
    </div>
  );
}
