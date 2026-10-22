import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function SignIn() {
  const { setIsAuthenticated, darkMode } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let endpoint = 'login';
      let payload: any = { email, password };

      if (mode === 'forgot') {
        endpoint = 'forgot-password';
        payload = { email };
      } else if (mode === 'signup') {
        endpoint = 'signup';
        payload = { email, password, first_name: firstName, last_name: lastName };
        if (!firstName.trim()) { setError('First name is required.'); setLoading(false); return; }
      }

      const resp = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();

      if (resp.ok) {
        if (mode === 'forgot') {
          setSuccess(data.message || 'Reset link sent!');
          setMode('signin');
        } else if (data.token) {
          localStorage.setItem('token', data.token);
          setIsAuthenticated(true);
          navigate('/dashboard');
        }
      } else {
        setError(data.error || 'Request failed.');
      }
    } catch (err) {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Multi-platform campaign management',
    'Real-time analytics & reporting',
    'AI-powered audience targeting',
    'Automated budget optimization',
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800'}`}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-white text-2xl" style={{ fontWeight: 700 }}>AdMaster</span>
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-white mb-3" style={{ fontWeight: 800, fontSize: '2.5rem', lineHeight: 1.2 }}>
              Power Your Ads.<br />
              Grow Your Business.
            </h1>
            <p className="text-indigo-200 text-lg">
              The all-in-one advertising platform trusted by 50,000+ marketers indiawide.
            </p>
          </div>
          <ul className="space-y-3">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-indigo-100">
                <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: '50K+', label: 'Advertisers' },
              { value: '$2.4B', label: 'Ad Spend' },
              { value: '99.9%', label: 'Uptime' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <p className="text-white text-xl" style={{ fontWeight: 700 }}>{s.value}</p>
                <p className="text-indigo-300 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-400 text-xs relative z-10">
          © 2026 AdMaster Technologies Pvt. Ltd. All rights reserved.
        </p>
      </div>

      {/* Right Panel – Login Card */}
      <div className={`flex flex-1 items-center justify-center p-6 lg:p-12 ${darkMode ? 'bg-gray-950' : 'bg-white/5 backdrop-blur-xl lg:bg-white'}`}>
        <div className={`w-full max-w-md ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 lg:shadow-2xl'} rounded-2xl border p-8`}>
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className={`text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontWeight: 700 }}>AdMaster</span>
          </div>

          <div className="mb-8">
            <h2 className={`mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontWeight: 700, fontSize: '1.75rem' }}>
              {mode === 'forgot' ? 'Reset Password' : (mode === 'signup' ? 'Create Account' : 'Welcome back')}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {mode === 'forgot' ? 'Enter email to receive reset link' : (mode === 'signup' ? 'Sign up to continue' : 'Sign in to your AdMaster account to continue')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`} />
                </div>
                <div>
                  <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`} />
                </div>
              </div>
            )}
            <div>
              <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ad2000@gmail.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>
                    Password
                  </label>
                  {mode === 'signin' && (
                    <a href="#" onClick={(e) => { e.preventDefault(); setMode('forgot'); setError(''); setSuccess(''); }} className="text-indigo-600 text-xs hover:text-indigo-700 transition-colors" style={{ fontWeight: 500 }}>
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="password"
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12 ${darkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}

                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setShowPass(!showPass); }}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  defaultChecked
                />
                <label htmlFor="remember" className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontWeight: 400 }}>
                  Remember me for 30 days
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ fontWeight: 600 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{mode === 'forgot' ? 'Send Reset Link' : (mode === 'signup' ? 'Sign Up' : 'Sign In')} <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className={`absolute inset-0 flex items-center`}>
              <div className={`w-full border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`} />
            </div>
            <div className="relative flex justify-center">
              <span className={`px-3 text-xs ${darkMode ? 'bg-gray-900 text-gray-500' : 'bg-white text-gray-400'}`}>
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <p className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {mode === 'signin' ? (
              <>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('signup'); setError(''); setSuccess(''); }} className="text-indigo-600 hover:text-indigo-700" style={{ fontWeight: 600 }}>Create Account</a></>
            ) : (
              <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('signin'); setError(''); setSuccess(''); }} className="text-indigo-600 hover:text-indigo-700" style={{ fontWeight: 600 }}>Sign In</a></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

