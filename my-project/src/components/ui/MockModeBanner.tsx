'use client';

import { isUsingMockApi } from '@/lib/api/client';

export function MockModeBanner() {
  if (!isUsingMockApi()) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-warning-light border border-warning-dark text-warning-dark px-4 py-2 rounded-lg text-sm font-medium shadow-card">
        🧪 Mock Data Mode - API calls simulated
      </div>
    </div>
  );
}