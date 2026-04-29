import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Send, AlertTriangle, Shield, EyeOff, Mail, Search, CheckCircle2 } from 'lucide-react';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'CIVIC', anonymous: true, contactEmail: '', locationLabel: '', priority: 'MEDIUM'
  });
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [photoAdded, setPhotoAdded] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setFormData({ ...formData, latitude: position.coords.latitude, longitude: position.coords.longitude }),
        () => alert('Could not get location. Please allow location access.')
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ text: '', type: '' });

    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const url = token ? 'http://localhost:8081/api/complaints' : 'http://localhost:8081/api/complaints/public';

    let mediaPath = '';
    if (uploadFile) {
      const multipart = new FormData();
      multipart.append('file', uploadFile);
      const uploadRes = await axios.post('http://localhost:8081/api/files/upload', multipart, { headers });
      mediaPath = uploadRes.data.path;
    }
    const submitData = token ? { ...formData, anonymous: false, mediaPath } : { ...formData, mediaPath };

    try {
      await axios.post(url, submitData, { headers });
      setStatusMsg({ text: 'Report submitted successfully! Thank you.', type: 'success' });
      setFormData({ title: '', description: '', category: 'CIVIC', anonymous: true, contactEmail: '', latitude: null, longitude: null });
      setPhotoAdded(false);
    } catch (err) {
      setStatusMsg({ text: 'Failed to submit report. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-emerald-50 px-4 py-10 font-sans text-slate-900 sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[72vw] -translate-x-1/2 rounded-full bg-emerald-300/15 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 top-24 h-56 w-56 rounded-full bg-white/10 blur-[110px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative z-10 mx-auto w-full max-w-3xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-orange-400/30 bg-gradient-to-br from-orange-500/20 to-red-500/10 shadow-[0_0_40px_rgba(249,115,22,0.18)]">
            <AlertTriangle className="h-10 w-10 text-orange-300" />
          </div>
          <h2 className="mb-3 bg-gradient-to-r from-orange-300 via-amber-300 to-red-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">Report an Issue</h2>
          <p className="text-slate-400">Provide accurate details so the right team can resolve it quickly.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-sm sm:p-8">
          <AnimatePresence mode="wait">
            {statusMsg.text && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className={`mb-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                  statusMsg.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}
              >
                {statusMsg.type === 'success' ? <Shield className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                {statusMsg.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Title</label>
              <input
                type="text"
                placeholder="Brief title (e.g., Deep pothole on Main St)"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white/95 p-3.5 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/25"
              />
            </div>

            <div>
              <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Description</label>
              <textarea
                placeholder="Describe the issue, landmarks, or anything helpful..."
                required
                rows="5"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="custom-scrollbar w-full resize-none rounded-xl border border-gray-200 bg-white/95 p-3.5 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/25"
              />
            </div>

            <div>
              <label className="mb-2 ml-1 block text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Category & Attachments</label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="group relative">
                  <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-orange-300" />
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white/95 py-3.5 pl-12 pr-9 text-slate-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-400/25"
                  >
                    <option value="CIVIC">Civic Issue</option>
                    <option value="POLICE">Police Assistance</option>
                    <option value="TOURIST">Tourist Infraction</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">v</span>
                </div>

                <button
                  type="button"
                  onClick={getLocation}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                    formData.latitude
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-gray-200 bg-white/95 text-slate-900 hover:bg-gray-100 hover:text-slate-900'
                  }`}
                >
                  {formData.latitude ? <CheckCircle2 size={18} /> : <MapPin size={18} />}
                  {formData.latitude ? 'Location Set' : 'Add Location'}
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoAdded(!photoAdded)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                    photoAdded
                      ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                      : 'border-gray-200 bg-white/95 text-slate-900 hover:bg-gray-100 hover:text-slate-900'
                  }`}
                >
                  <Camera size={18} />
                  {photoAdded ? 'Photo Added' : 'Add Photo'}
                </button>
              </div>
              <input type="file" accept="image/*,video/mp4" onChange={(e) => setUploadFile(e.target.files?.[0])} className="mt-3 block w-full text-sm text-slate-700" />
            </div>
              <input value={formData.locationLabel} onChange={e => setFormData({ ...formData, locationLabel: e.target.value })} placeholder="Location name / area" className="w-full rounded-xl border border-gray-200 bg-white/95 p-3.5 text-slate-900 outline-none" />

            {!localStorage.getItem('token') && (
              <div className="rounded-xl border border-gray-200 bg-white/95 p-4">
                <label className="group flex w-max cursor-pointer items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${formData.anonymous ? 'bg-orange-500' : 'border border-gray-200 bg-white/95'}`}>
                    {formData.anonymous && <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <input type="checkbox" checked={formData.anonymous} onChange={e => setFormData({ ...formData, anonymous: e.target.checked })} className="sr-only" />
                  <div className="flex items-center gap-2">
                    <EyeOff size={16} className={formData.anonymous ? 'text-orange-300' : 'text-slate-500'} />
                    <span className="select-none font-semibold text-slate-700">Submit Anonymously</span>
                  </div>
                </label>

                <AnimatePresence>
                  {!formData.anonymous && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="relative mt-4">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          placeholder="Contact Email (Optional)"
                          value={formData.contactEmail}
                          onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                          className="w-full rounded-xl border border-gray-200 bg-white/95 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/25"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4 text-base font-bold text-white shadow-lg shadow-orange-950/30 transition-all hover:from-orange-400 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  Submit Report
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
