import Link from 'next/link';
export default function Home(){
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Restaurant AI (SQLite)</h1>
      <p>Upload CSV, rebuild forecast, see margins & purchase list.</p>
      <div className="space-x-4">
        <Link className="underline" href="/dashboard">Go to Dashboard</Link>
      </div>
    </main>
  );
}
