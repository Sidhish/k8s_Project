import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8081';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    axios.get(`${API}/api/analytics/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, []);

  if (!data) return <div className="min-h-screen bg-slate-900 p-6 text-white">Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <h2 className="mb-4 text-2xl font-bold">Analytics & Heatmap Data</h2>
      <pre className="overflow-auto rounded bg-slate-800 p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
      <a className="mt-4 inline-block rounded bg-emerald-600 px-4 py-2" href={`${API}/api/analytics/report.csv`} target="_blank">Download CSV Report</a>
    </div>
  );
}
