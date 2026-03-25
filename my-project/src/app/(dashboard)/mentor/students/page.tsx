'use client';

import { useState } from 'react';
import { Search, TrendingUp, BookOpen, MessageSquare } from 'lucide-react';
import { mockMentorStats, mockProgress } from '@/lib/api/mockData';

const students = [
  { id: 'usr_123', fullName: 'Jean Pierre Niyonzima', school: 'GS Ruyenzi', grade: 'Senior 4', score: 88, modules: 3, status: 'On Track' },
  { id: 'usr_124', fullName: 'Marie Uwimana', school: 'ES Kigali', grade: 'Senior 5', score: 85, modules: 4, status: 'On Track' },
  { id: 'usr_125', fullName: 'Emmanuel Habimana', school: 'GS Musanze', grade: 'Senior 3', score: 62, modules: 2, status: 'Needs Help' },
  { id: 'usr_126', fullName: 'Claudine Mukamana', school: 'GS Huye', grade: 'Senior 4', score: 74, modules: 2, status: 'On Track' },
  { id: 'usr_127', fullName: 'Patrick Nzabonimpa', school: 'ES Rubavu', grade: 'Senior 6', score: 91, modules: 5, status: 'Excellent' },
];

const statusColors: Record<string, string> = {
  'Excellent': 'bg-emerald-100 text-emerald-700',
  'On Track':  'bg-blue-100 text-blue-700',
  'Needs Help':'bg-amber-100 text-amber-700',
};

export default function MentorStudents() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(students[0]);

  const filtered = students.filter((s) =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.school.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Students</h1>
        <p className="text-sm text-gray-500 mt-0.5">{students.length} students assigned to you</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            />
          </div>
          <div className="space-y-1">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                  selected.id === s.id ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {s.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{s.school}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${statusColors[s.status]}`}>
                    {s.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Student Detail */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 flex items-center justify-center text-white text-lg font-bold">
                {selected.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">{selected.fullName}</h2>
                <p className="text-sm text-gray-500">{selected.school} · {selected.grade}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Avg Score', value: `${selected.score}%`, icon: TrendingUp },
                { label: 'Modules Done', value: selected.modules, icon: BookOpen },
                { label: 'Sessions', value: 2, icon: MessageSquare },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Module Progress</h3>
            <div className="space-y-3">
              {mockProgress.modules.map((m) => (
                <div key={m.moduleId}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">{m.moduleTitle}</span>
                    <span>{m.completedExercises}/{m.totalExercises} exercises</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(m.completedExercises / m.totalExercises) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
