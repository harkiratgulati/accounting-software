'use client';
import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type SalesPoint = { date: string; revenue: number };
type ForecastPoint = { date: string; qty: number };
type TopItem = { name: string; qty: number; revenue: number };

export default function Charts() {
  const [data, setData] = useState<{salesSeries: SalesPoint[]; topItems: TopItem[]; forecastSeries: ForecastPoint[]}>({salesSeries:[], topItems:[], forecastSeries:[]});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/metrics/overview');
        const j = await res.json();
        setData(j);
      } catch (e:any) {
        setErr(e.message || 'failed');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <main className="p-8 max-w-4xl mx-auto">Loading…</main>;
  if (err) return <main className="p-8 max-w-4xl mx-auto">Error: {err}</main>;

  const salesLabels = data.salesSeries.map(p => p.date.slice(5));
  const salesValues = data.salesSeries.map(p => p.revenue);
  const forecastLabels = data.forecastSeries.map(p => p.date.slice(5));
  const forecastValues = data.forecastSeries.map(p => p.qty);
  const topLabels = data.topItems.map(t => t.name);
  const topValues = data.topItems.map(t => t.revenue);

  return (
    <main className="p-8 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-semibold">Visual Dashboard</h1>

      <section className="bg-white rounded-xl p-4 shadow">
        <h2 className="font-medium mb-2">Sales (last 30 days)</h2>
        <Line data={{ labels: salesLabels, datasets: [{ label: 'Revenue', data: salesValues }] }} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </section>

      <section className="bg-white rounded-xl p-4 shadow">
        <h2 className="font-medium mb-2">Forecast (next 14 days, total qty)</h2>
        <Bar data={{ labels: forecastLabels, datasets: [{ label: 'Qty', data: forecastValues }] }} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </section>

      <section className="bg-white rounded-xl p-4 shadow">
        <h2 className="font-medium mb-2">Top Items (last 30 days by revenue)</h2>
        <Bar data={{ labels: topLabels, datasets: [{ label: 'Revenue', data: topValues }] }} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </section>
    </main>
  );
}
