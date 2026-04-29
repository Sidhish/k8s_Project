import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, AlertTriangle, Plus, Activity, Search, CalendarDays } from 'lucide-react';

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem('token');
      if (!token) return window.location.href = '/login';
      try {
        const res = await axios.get('http://localhost:8081/api/complaints', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaints(res.data);
      } catch (err) {
        console.error('Error fetching complaints', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusDetails = (status) => {
    switch (status) {
      case 'SUBMITTED': return { icon: <AlertCircle size={16} />, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' };
      case 'IN_PROGRESS': return { icon: <Clock size={16} />, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' };
      case 'RESOLVED': return { icon: <CheckCircle size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' };
      case 'CLOSED': return { icon: <CheckCircle size={16} />, color: 'text-slate-400', bg: 'bg-slate-400/10 border-slate-400/20' };
      default: return { icon: <AlertTriangle size={16} />, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' };
    }
  };

  const getCategoryDetails = (cat) => {
    switch(cat) {
      case 'POLICE': return { label: 'Police', style: 'text-red-300 bg-red-500/10 border-red-500/20' };
      case 'CIVIC': return { label: 'Civic', style: 'text-orange-300 bg-orange-500/10 border-orange-500/20' };
      case 'TOURIST': return { label: 'Tourist', style: 'text-purple-300 bg-purple-500/10 border-purple-500/20' };
      default: return { label: cat, style: 'text-slate-300 bg-slate-500/10 border-slate-500/20' };
    }
  };

  const filteredComplaints = complaints.filter(c => filter === 'ALL' || c.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 pb-20 font-sans text-slate-200">
      <div className="relative overflow-hidden border-b border-slate-700/50 bg-slate-800/40 px-4 pb-24 pt-10 sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[70vw] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-white/10 blur-[100px]" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 flex items-center gap-3">
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/15 p-2.5">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">My Dashboard</h1>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="max-w-2xl text-base text-slate-400 sm:text-lg">
              Track every complaint, monitor progress, and stay updated in real time.
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => window.location.href='/submit'}
            className="group inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-900/25 transition-all hover:-translate-y-0.5 hover:from-blue-500 hover:to-emerald-500"
          >
            <Plus size={19} className="transition-transform duration-300 group-hover:rotate-90" />
            New Report
          </motion.button>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-12 w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-700/50 bg-slate-800/80 p-4 shadow-xl backdrop-blur-xl">
          <div className="custom-scrollbar flex w-full gap-2 overflow-x-auto rounded-xl bg-slate-900/60 p-1.5 md:w-auto">
            {['ALL', 'SUBMITTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  filter === status ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="w-full text-right text-sm font-medium text-slate-400 md:w-auto md:text-left">
            Total Reports
            <span className="ml-2 rounded-md bg-slate-700 px-2.5 py-1 font-semibold text-white">{filteredComplaints.length}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <svg className="mb-4 h-10 w-10 animate-spin text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p className="animate-pulse font-medium">Loading your reports...</p>
          </div>
        ) : (
          <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredComplaints.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700/60 bg-slate-800/30 py-20 text-center"
                >
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">
                    <Search className="h-10 w-10 text-slate-500" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">No reports found</h3>
                  <p className="mb-7 max-w-md text-slate-400">
                    {filter === 'ALL' ? "You haven't submitted any complaints yet. Your reports will appear here." : `No reports found for '${filter.replace('_', ' ')}'.`}
                  </p>
                  {filter === 'ALL' && (
                    <button onClick={() => window.location.href='/submit'} className="rounded-xl border border-slate-600 bg-slate-800 px-5 py-3 font-semibold text-white transition-colors hover:bg-slate-700">
                      Create your first report
                    </button>
                  )}
                </motion.div>
              )}

              {filteredComplaints.map((c, i) => {
                const statusInfo = getStatusDetails(c.status);
                const catInfo = getCategoryDetails(c.category);
                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: i * 0.04 }}
                    key={c.id}
                    className="group flex h-full flex-col rounded-2xl border border-slate-700/50 bg-slate-800/60 p-5 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-slate-500/60 hover:shadow-xl hover:shadow-blue-900/10"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <span className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${catInfo.style}`}>
                        {catInfo.label}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold leading-tight text-white transition-colors group-hover:text-blue-300">{c.title}</h3>
                    <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-400">{c.description}</p>

                    <div className="mt-auto flex items-center justify-between border-t border-slate-700/50 pt-4 text-xs font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/50 px-2.5 py-1.5">
                        <CalendarDays size={14} className="text-slate-400" />
                        {new Date(c.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-slate-600">#{c.id.toString().padStart(4, '0')}</span>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
