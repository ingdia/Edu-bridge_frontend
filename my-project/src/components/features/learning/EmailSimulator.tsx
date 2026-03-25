'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, RotateCcw, Inbox, Paperclip } from 'lucide-react';

interface EmailSimulatorProps {
  scenario: {
    title:       string;
    instructions: string;
    to:          string;
    subjectHint: string;
    bodyHint:    string;
    checklist:   string[];
  };
  onComplete?: (score: number) => void;
}

export function EmailSimulator({ scenario, onComplete }: EmailSimulatorProps) {
  const [to, setTo]           = useState(scenario.to);
  const [subject, setSubject] = useState('');
  const [body, setBody]       = useState('');
  const [sent, setSent]       = useState(false);
  const [score, setScore]     = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

  const evaluate = () => {
    const checks: { label: string; pass: boolean }[] = [
      { label: 'Has a recipient email address',    pass: to.includes('@') },
      { label: 'Subject line is not empty',        pass: subject.trim().length > 3 },
      { label: 'Subject is professional (no slang)', pass: !/hey|yo|sup|lol/i.test(subject) },
      { label: 'Body starts with a greeting',      pass: /^(dear|hello|good morning|good afternoon|hi)/i.test(body.trim()) },
      { label: 'Body is at least 30 words',        pass: body.trim().split(/\s+/).length >= 30 },
      { label: 'Body ends with a sign-off',        pass: /(sincerely|regards|thank you|best wishes|yours)/i.test(body) },
      { label: 'No spelling of "your" as "ur"',    pass: !/\bur\b/i.test(body) },
    ];

    const passed  = checks.filter((c) => c.pass).length;
    const total   = checks.length;
    const pct     = Math.round((passed / total) * 100);
    const fb      = checks.map((c) => `${c.pass ? '✅' : '❌'} ${c.label}`);

    setScore(pct);
    setFeedback(fb);
    setSent(true);
    onComplete?.(pct);
  };

  const reset = () => {
    setSubject('');
    setBody('');
    setSent(false);
    setScore(0);
    setFeedback([]);
  };

  if (sent) {
    return (
      <div className="space-y-4">
        {/* Sent confirmation */}
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">Email sent!</p>
            <p className="text-xs text-emerald-600">Your email was delivered to {to}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-black text-emerald-700">{score}%</div>
            <div className="text-xs text-emerald-600">Score</div>
          </div>
        </div>

        {/* Feedback checklist */}
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Feedback</p>
          <div className="space-y-1.5">
            {feedback.map((f, i) => (
              <p key={i} className="text-sm text-gray-700">{f}</p>
            ))}
          </div>
        </div>

        {score < 100 && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-1">Task</p>
        <p className="text-sm text-gray-700">{scenario.instructions}</p>
      </div>

      {/* Email composer */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header bar */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="w-3 h-3 rounded-full bg-gray-200" />
            <span className="w-3 h-3 rounded-full bg-gray-200" />
          </div>
          <span className="text-xs text-gray-400 ml-2">New Message</span>
        </div>

        <div className="divide-y divide-gray-100">
          {/* To */}
          <div className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-xs font-semibold text-gray-400 w-14 shrink-0">To</span>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 text-sm text-gray-900 focus:outline-none bg-transparent"
              placeholder="recipient@example.com"
            />
          </div>

          {/* Subject */}
          <div className="flex items-center gap-3 px-4 py-2.5">
            <span className="text-xs font-semibold text-gray-400 w-14 shrink-0">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 text-sm text-gray-900 focus:outline-none bg-transparent"
              placeholder={scenario.subjectHint}
            />
          </div>

          {/* Body */}
          <div className="px-4 py-3">
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full text-sm text-gray-900 focus:outline-none resize-none bg-transparent placeholder-gray-300"
              placeholder={scenario.bodyHint}
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3">
          <button
            onClick={evaluate}
            disabled={!subject.trim() || !body.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" /> Send
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Paperclip className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400 ml-auto">
            {body.trim().split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
      </div>

      {/* Checklist hints */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Checklist</p>
        <div className="space-y-1">
          {scenario.checklist.map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-gray-600">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Default scenario for the digital literacy module
export const defaultEmailScenario = {
  title:        'Compose Your First Professional Email',
  instructions: 'Write a professional email to your teacher asking about an upcoming assignment. Use proper greetings, clear language, and a polite sign-off.',
  to:           'teacher@gs-ruyenzi.rw',
  subjectHint:  'e.g. Question About the English Assignment',
  bodyHint:     'Dear [Teacher],\n\nI am writing to ask about...\n\nThank you,\n[Your Name]',
  checklist: [
    'Start with "Dear [Name]," or "Good morning,"',
    'Clearly state your reason for writing',
    'Use complete sentences — no abbreviations',
    'End with "Sincerely," or "Thank you,"',
    'Write at least 30 words',
  ],
};
