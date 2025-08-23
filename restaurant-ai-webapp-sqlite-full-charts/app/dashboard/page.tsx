'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');

  async function api(path: string, init?: RequestInit) {
    const res = await fetch(path, init);
    const j = await res.json();
    setMsg(JSON.stringify(j, null, 2));
  }

  async function onUpload() {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    await api('/api/import', { method: 'POST', body: fd });
  }

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-2">Upload orders CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={onUpload}
            className="ml-2 px-3 py-1 rounded bg-black text-white"
          >
            Import
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => api('/api/forecast/rebuild', { method: 'POST' })}
            className="px-3 py-1 rounded bg-black text-white"
          >
            Rebuild forecast
          </button>
          <button
            onClick={() => api('/api/menu/margins')}
            className="px-3 py-1 rounded bg-black text-white"
          >
            Menu margins
          </button>
          <button
            onClick={() => api('/api/purchase-list')}
            className="px-3 py-1 rounded bg-black text-white"
          >
            Purchase list
          </button>
          <button
            onClick={() => api('/api/digest/today')}
            className="px-3 py-1 rounded bg-black text-white"
          >
            Today digest
          </button>

          {/* Link to charts page */}
          <a
            href="/dashboard/charts"
            className="px-3 py-1 rounded bg-white border"
          >
            Open charts
          </a>
        </div>

        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto h-80">
{msg}
        </pre>
      </div>
    </main>
  );
}
