import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Bell, Activity, MapPin, ShieldAlert, ChevronDown, CheckCircle, Clock, EyeOff, Radio } from 'lucide-react';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [keyword, setKeyword] = useState('');
  const [officers, setOfficers] = useState([]);
  const [selectedOfficerByComplaint, setSelectedOfficerByComplaint] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !['ADMIN', 'SUPER_ADMIN'].includes(localStorage.getItem('role'))) {
      window.location.href = '/login';
      return;
    }

    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/admin/complaints${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        setComplaints(data);

        setStats({
          total: data.length,
          pending: data.filter(c => c.status === 'SUBMITTED' || c.status === 'IN_PROGRESS').length,
          resolved: data.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length
        });
      } catch (err) {
        console.error('Error fetching complaints', err);
      }
    };

    const fetchOfficers = async () => {
      try {
        const officerRes = await axios.get('http://localhost:8081/api/admin/officers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOfficers(officerRes.data);
      } catch (err) {
        console.error('Error fetching officers', err);
      }
    };

    fetchComplaints();
    fetchOfficers();

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/admin/complaints', (msg) => {
          setLiveAlerts(prev => [{ id: Date.now(), text: msg.body }, ...prev].slice(0, 5));
          fetchComplaints();
        });
      },
      onStompError: (frame) => {
        console.error('Broker error', frame.headers['message']);
      }
    });

    stompClient.activate();

    return () => stompClient.deactivate();
  }, [keyword]);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8081/api/admin/complaints/${id}/status`, { status, remarks: `Updated by admin to ${status}` }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = complaints.map(c => c.id === id ? { ...c, status } : c);
      setComplaints(updated);
      setStats({
        total: updated.length,
        pending: updated.filter(c => c.status === 'SUBMITTED' || c.status === 'IN_PROGRESS').length,
        resolved: updated.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length
      });
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const assignComplaint = async (complaintId) => {
    const officerId = selectedOfficerByComplaint[complaintId];
    if (!officerId) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8081/api/admin/complaints/${complaintId}/assign`, {
        officerId,
        remarks: 'Assigned by admin'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = complaints.map(c => c.id === complaintId ? { ...c, assignedOfficer: { id: officerId }, status: 'IN_PROGRESS' } : c);
      setComplaints(updated);
    } catch (err) {
      console.error('Error assigning complaint', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
      case 'IN_PROGRESS': return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
      case 'RESOLVED': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
      default: return 'bg-slate-700/60 border-slate-600/50 text-slate-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'POLICE': return 'bg-red-500/10 border-red-500/30 text-red-300';
      case 'CIVIC': return 'bg-orange-500/10 border-orange-500/30 text-orange-300';
      case 'TOURIST': return 'bg-purple-500/10 border-purple-500/30 text-purple-300';
      default: return 'bg-slate-500/10 border-slate-500/30 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50 pb-10 font-sans text-slate-900">
      <div className="relative overflow-hidden border-b border-gray-200 bg-white/90 px-4 py-8 backdrop-blur-sm sm:px-6">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[70vw] -translate-x-1/2 rounded-full bg-emerald-400/12 blur-[120px]" />
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-white/10 blur-[130px]" />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/15 p-3 text-indigo-300 shadow-[0_0_24px_rgba(99,102,241,0.2)]">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent">Admin Command Center</h2>
              <p className="mt-1 text-sm text-slate-600">Monitor incoming complaints and manage status updates in real time.</p>
            </div>
          </div>

          <div className="flex w-full gap-3 overflow-x-auto pb-1 lg:w-auto">
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search..." className="rounded-lg border border-gray-200 bg-white/90 px-3 py-2 text-sm text-slate-700" />
            <div className="min-w-[140px] rounded-xl border border-gray-200 bg-white/90 px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-slate-600"><Activity className="h-4 w-4 text-blue-500" /> Total</div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <div className="min-w-[140px] rounded-xl border border-gray-200 bg-white/90 px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-slate-600"><Clock className="h-4 w-4 text-amber-500" /> Pending</div>
              <div className="text-2xl font-bold text-slate-900">{stats.pending}</div>
            </div>
            <div className="min-w-[140px] rounded-xl border border-gray-200 bg-white/90 px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-slate-600"><CheckCircle className="h-4 w-4 text-emerald-500" /> Resolved</div>
              <div className="text-2xl font-bold text-slate-900">{stats.resolved}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 gap-6 px-4 xl:grid-cols-4 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-gray-200 bg-white/90 shadow-sm xl:col-span-3"
        >
          <div className="flex items-center justify-between border-b border-gray-200 bg-white/90 px-5 py-4">
            <h3 className="text-lg font-bold text-slate-900">Live Complaints Table</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300">
              <Radio className="h-3 w-3 animate-pulse" /> Live
            </span>
          </div>

          <div className="max-h-[70vh] overflow-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
                  <tr className="border-b border-gray-200 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  <th className="p-4 pl-6">Incident</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Assign Officer</th>
                </tr>
              </thead>
              <tbody>
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-500">No complaints available inside the system.</td>
                  </tr>
                )}

                {complaints.map((c) => (
                  <tr key={c.id} className="group border-b border-gray-200 transition-colors hover:bg-gray-50">
                    <td className="min-w-[320px] p-4 pl-6 align-top">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 rounded border border-gray-200 bg-white/90 px-2 py-1 text-[10px] font-bold text-slate-600">#{c.id.toString().padStart(4, '0')}</span>
                        <div>
                          <p className="font-semibold leading-tight text-slate-900 transition-colors group-hover:text-cyan-600">{c.title}</p>
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{c.description}</p>
                          {c.latitude && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-300">
                              <MapPin size={12} /> {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <span className={`rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(c.category)}`}>
                        {c.category}
                      </span>
                    </td>

                    <td className="p-4 align-top">
                      <div className="relative inline-block w-40">
                        <select
                          value={c.status}
                          onChange={(e) => updateStatus(c.id, e.target.value)}
                          className={`w-full cursor-pointer appearance-none rounded-lg border py-2 pl-3 pr-8 text-xs font-bold outline-none transition-all hover:brightness-110 ${getStatusColor(c.status)}`}
                        >
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      {c.anonymous ? (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                          <EyeOff size={12} /> Anonymous
                        </span>
                      ) : (
                        <div className="text-xs">
                          <p className="font-medium text-slate-700">User #{c.user?.id || 'Unknown'}</p>
                          {c.contactEmail && (
                            <p className="mt-0.5 max-w-[140px] truncate text-[10px] text-slate-600" title={c.contactEmail}>{c.contactEmail}</p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex min-w-[190px] gap-2">
                        <select
                          value={selectedOfficerByComplaint[c.id] || c.assignedOfficer?.id || ''}
                          onChange={(e) => setSelectedOfficerByComplaint(prev => ({ ...prev, [c.id]: Number(e.target.value) }))}
                          className="w-full rounded-md border border-gray-200 bg-white/90 px-2 py-2 text-xs text-slate-700"
                        >
                          <option value="">Select officer</option>
                          {officers.map((o) => (
                            <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                          ))}
                        </select>
                        <button onClick={() => assignComplaint(c.id)} className="rounded bg-emerald-600 px-2 py-2 text-xs font-semibold">Assign</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-6 flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/60 p-5 shadow-xl backdrop-blur-xl xl:col-span-1"
        >
          <div className="mb-4 flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <div className="rounded-lg bg-amber-500/20 p-1.5"><Bell size={16} /></div>
              Real-time Alerts
            </div>
            <span className="text-xs text-slate-500">{liveAlerts.length}/5</span>
          </div>

          <div className="custom-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
            <AnimatePresence>
              {liveAlerts.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-10 text-center text-sm text-slate-500">
                  <Activity className="h-8 w-8 opacity-25" />
                  Listening for incoming reports...
                </motion.div>
              )}

              {liveAlerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18, height: 0, marginBottom: 0 }}
                  className="relative rounded-r-xl rounded-l-md border-l-2 border-amber-400 bg-gradient-to-r from-amber-500/10 to-transparent p-3 pr-8 text-sm"
                >
                  <p className="mb-1 text-xs font-semibold text-amber-300">New Report Detected</p>
                  <p className="leading-snug text-slate-300">{alert.text}</p>
                  <span className="absolute right-2.5 top-3 h-2 w-2 rounded-full bg-amber-400" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
