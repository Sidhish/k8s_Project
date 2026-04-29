import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:8081/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        if (res.data.role === 'ADMIN' || res.data.role === 'SUPER_ADMIN') navigate('/admin');
        else if (res.data.role === 'OFFICER') navigate('/officer');
        else navigate('/dashboard');
      } else {
        await axios.post('http://localhost:8081/api/auth/register', { name, email, password, role });
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      const respData = err?.response?.data;
      const message = typeof respData === 'string' ? respData : respData?.message || err.message || JSON.stringify(respData) || 'An error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-emerald-50 px-4 py-8 font-sans text-slate-900">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/20 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-64 w-[60vw] rounded-full bg-white/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl border border-slate-700/60 bg-slate-800/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <motion.div layout className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
              <Sparkles className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="bg-gradient-to-r from-blue-300 via-indigo-300 to-emerald-300 bg-clip-text pb-1 text-3xl font-bold text-transparent">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {isLogin ? 'Sign in to manage and track your complaints.' : 'Register to submit reports and monitor progress.'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
                  error.includes('successful')
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="mb-1.5 ml-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Full Name</label>
                  <div className="group relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-300" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white/95 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {!isLogin && (
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white/95 py-3.5 pl-4 pr-4 text-slate-900 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25"
              >
                <option value="CITIZEN">Citizen</option>
                <option value="OFFICER">Officer</option>
              </select>
            )}

            <div>
              <label className="mb-1.5 ml-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Email</label>
              <div className="group relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-300" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/95 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/25"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 ml-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Password</label>
              <div className="group relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-emerald-300" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/95 py-3.5 pl-12 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/25"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/40 transition-all hover:from-blue-500 hover:via-indigo-500 hover:to-emerald-500 hover:shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Or continue with</span>
            <div className="h-px flex-1 bg-slate-700" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-600 bg-white/5 px-4 py-3.5 font-semibold text-white transition-all hover:border-slate-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>

          <p className="mt-7 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
