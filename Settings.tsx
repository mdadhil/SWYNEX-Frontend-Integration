import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  Bell,
  Shield,
  Globe,
  Palette,
  Moon,
  Sun,
  Mail,
  Smartphone,
  Lock,
  User,
} from 'lucide-react';

export default function Settings() {
  const { darkMode, toggleDarkMode, fetchUser } = useApp();

  const [firstName, setFirstName] = useState('Arjun');
  const [lastName, setLastName] = useState('Sharma');
  const [email, setEmail] = useState('arjun.sharma@admaster.io');
  const [role, setRole] = useState('Campaign Manager');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passSaved, setPassSaved] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [accentColor, setAccentColor] = useState('#6366F1');

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/settings/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        if (data.role) setRole(data.role);
        if (data.profile_photo) setAvatar(data.profile_photo);
      }
    } catch(err) {}
  };

  useEffect(() => { fetchProfile(); }, []);


  const [notifications, setNotifications] = useState({
    emailCampaign: true,
    emailBilling: true,
    emailReport: false,
    pushCampaign: true,
    pushPerformance: true,
    pushBudget: false,
    smsAlerts: false,
  });

  const cardBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
    }`;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/settings/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          first_name: firstName, 
          last_name: lastName, 
          email,
          role,
          profile_photo: avatar
        })
      });
      fetchUser(); // Force the top navbar to refresh
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch(err) {}
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass) { alert("Please enter current password"); return; }
    if (newPass.length < 8) { alert("New password must be at least 8 characters"); return; }
    if (newPass !== confirmPass) { alert("Passwords do not match"); return; }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/settings/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPass, new_password: newPass })
      });
      const data = await res.json();
      if (res.ok) {
        setPassSaved(true);
        setCurrentPass(''); setNewPass(''); setConfirmPass('');
        setTimeout(() => setPassSaved(false), 3000);
      } else {
        alert(data.error || "Failed to update password");
      }
    } catch(err) { alert("Network error"); }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-indigo-600' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className={textPrimary} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Settings</h1>
        <p className={`text-sm mt-1 ${textSecondary}`}>Manage your account preferences and security</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <div className="sm:w-48 flex-shrink-0">
          <div className={`${cardBg} rounded-2xl border p-2`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all mb-0.5 last:mb-0 ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              {/* Profile Photo */}
              <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
                <h3 className={`mb-5 ${textPrimary}`} style={{ fontWeight: 600 }}>Profile Photo</h3>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl" style={{ fontWeight: 700 }}>
                        AS
                      </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-all shadow-lg">
                      <Upload size={13} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            try {
                              const token = localStorage.getItem('token');
                              const res = await fetch('http://localhost:5000/api/upload/media', {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` },
                                body: formData
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setAvatar(`http://localhost:5000${data.url}`);
                              }
                            } catch(err) {}
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <p className={textPrimary} style={{ fontWeight: 600 }}>{firstName} {lastName}</p>
                    <p className={`text-sm ${textSecondary}`}>{email}</p>
                    <p className={`text-xs mt-1 ${textSecondary}`}>JPG, PNG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Profile Info Form */}
              <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
                <h3 className={`mb-5 ${textPrimary}`} style={{ fontWeight: 600 }}>Personal Information</h3>
                <form onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>First Name</label>
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Last Name</label>
                      <input value={lastName} onChange={e => setLastName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Email Address</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Phone Number</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Role</label>
                      <select value={role} onChange={e => setRole(e.target.value)} className={inputClass}>
                        {['Campaign Manager', 'Account Executive', 'Marketing Director', 'Growth Lead', 'Digital Strategist', 'Brand Manager'].map(r => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Bio</label>
                      <textarea
                        rows={3}
                        placeholder="Tell us a bit about yourself..."
                        defaultValue="Digital marketing professional with 5+ years of experience in performance advertising and campaign management."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
                      style={{ fontWeight: 600 }}
                    >
                      <Save size={15} /> Save Changes
                    </button>
                    {profileSaved && (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-sm">
                        <CheckCircle size={15} />
                        <span style={{ fontWeight: 500 }}>Profile updated!</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <h3 className={`mb-5 ${textPrimary}`} style={{ fontWeight: 600 }}>Change Password</h3>
              <form onSubmit={handleUpdatePassword}>
                <div className="space-y-4">
                  {[
                    { label: 'Current Password', val: currentPass, set: setCurrentPass, show: showCurrentPass, toggle: () => setShowCurrentPass(p => !p) },
                    { label: 'New Password', val: newPass, set: setNewPass, show: showNewPass, toggle: () => setShowNewPass(p => !p) },
                    { label: 'Confirm New Password', val: confirmPass, set: setConfirmPass, show: showConfirmPass, toggle: () => setShowConfirmPass(p => !p) },
                  ].map(f => (
                    <div key={f.label}>
                      <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>{f.label}</label>
                      <div className="relative">
                        <input
                          type={f.show ? 'text' : 'password'}
                          value={f.val}
                          onChange={e => f.set(e.target.value)}
                          placeholder="••••••••"
                          className={`${inputClass} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={f.toggle}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          {f.show ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Password strength */}
                {newPass && (
                  <div className="mt-3">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${newPass.length >= i * 3
                            ? i <= 2 ? 'bg-orange-500' : 'bg-emerald-500'
                            : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${textSecondary}`}>
                      {newPass.length < 8 ? 'Too short (min 8 chars)' : newPass.length < 12 ? 'Good' : 'Strong password'}
                    </p>
                  </div>
                )}

                {confirmPass && newPass !== confirmPass && (
                  <p className="text-red-500 text-xs mt-2">Passwords do not match</p>
                )}

                <div className="flex items-center gap-3 mt-5">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                    style={{ fontWeight: 600 }}
                  >
                    <Shield size={15} /> Update Password
                  </button>
                  {passSaved && (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-sm">
                      <CheckCircle size={15} />
                      <span style={{ fontWeight: 500 }}>Password updated!</span>
                    </div>
                  )}
                </div>
              </form>

              {/* 2FA Section */}
              <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 600 }}>Two-Factor Authentication</p>
                    <p className={`text-xs mt-0.5 ${textSecondary}`}>Add an extra layer of security to your account</p>
                  </div>
                  <Toggle checked={false} onChange={() => { }} />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <h3 className={`mb-5 ${textPrimary}`} style={{ fontWeight: 600 }}>Notification Preferences</h3>
              <div className="space-y-5">
                {/* Email */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Mail size={16} className="text-indigo-600" />
                    <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 600 }}>Email Notifications</p>
                  </div>
                  <div className="space-y-3 pl-6">
                    {[
                      { key: 'emailCampaign', label: 'Campaign updates', desc: 'Status changes and milestones' },
                      { key: 'emailBilling', label: 'Billing alerts', desc: 'Invoices and payment confirmations' },
                      { key: 'emailReport', label: 'Weekly reports', desc: 'Performance summary every Monday' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>{item.label}</p>
                          <p className={`text-xs ${textSecondary}`}>{item.desc}</p>
                        </div>
                        <Toggle
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`} />

                {/* Push */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bell size={16} className="text-purple-600" />
                    <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 600 }}>Push Notifications</p>
                  </div>
                  <div className="space-y-3 pl-6">
                    {[
                      { key: 'pushCampaign', label: 'Campaign alerts', desc: 'Immediate campaign status updates' },
                      { key: 'pushPerformance', label: 'Performance alerts', desc: 'When metrics exceed thresholds' },
                      { key: 'pushBudget', label: 'Budget warnings', desc: 'When budget reaches limit' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>{item.label}</p>
                          <p className={`text-xs ${textSecondary}`}>{item.desc}</p>
                        </div>
                        <Toggle
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`} />

                {/* SMS */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone size={16} className="text-emerald-600" />
                    <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 600 }}>SMS Alerts</p>
                  </div>
                  <div className="pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>Critical alerts only</p>
                        <p className={`text-xs ${textSecondary}`}>Payment failures and account issues</p>
                      </div>
                      <Toggle
                        checked={notifications.smsAlerts}
                        onChange={() => setNotifications(prev => ({ ...prev, smsAlerts: !prev.smsAlerts }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
              <h3 className={`mb-5 ${textPrimary}`} style={{ fontWeight: 600 }}>Appearance Settings</h3>

              {/* Theme */}
              <div className="mb-6">
                <p className={`text-sm mb-3 ${textPrimary}`} style={{ fontWeight: 500 }}>Color Theme</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { if (darkMode) toggleDarkMode(); }}
                    className={`p-4 rounded-xl border-2 transition-all ${!darkMode ? 'border-indigo-500' : darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                  >
                    <div className="w-full h-16 rounded-lg bg-white border border-gray-200 mb-2 flex items-center justify-center">
                      <Sun size={20} className="text-amber-500" />
                    </div>
                    <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>Light Mode</p>
                  </button>
                  <button
                    onClick={() => { if (!darkMode) toggleDarkMode(); }}
                    className={`p-4 rounded-xl border-2 transition-all ${darkMode ? 'border-indigo-500' : 'border-gray-200'
                      }`}
                  >
                    <div className="w-full h-16 rounded-lg bg-gray-900 mb-2 flex items-center justify-center">
                      <Moon size={20} className="text-indigo-400" />
                    </div>
                    <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>Dark Mode</p>
                  </button>
                </div>
              </div>

              {/* Accent Color */}
              <div className="mb-6">
                <p className={`text-sm mb-3 ${textPrimary}`} style={{ fontWeight: 500 }}>Accent Color</p>
                <div className="flex gap-3">
                  {[
                    { color: '#6366F1', name: 'Indigo' },
                    { color: '#8B5CF6', name: 'Violet' },
                    { color: '#06B6D4', name: 'Cyan' },
                    { color: '#10B981', name: 'Emerald' },
                    { color: '#F59E0B', name: 'Amber' },
                    { color: '#EF4444', name: 'Red' },
                  ].map(c => (
                    <button
                      key={c.color}
                      onClick={() => setAccentColor(c.color)}
                      className="w-8 h-8 rounded-full relative border-2 border-white shadow-md transition-transform hover:scale-110"
                      style={{ background: c.color }}
                      title={c.name}
                    >
                      {c.color === accentColor && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle size={14} className="text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <p className={`text-sm mb-2 ${textPrimary}`} style={{ fontWeight: 500 }}>Language & Region</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs mb-1 ${textSecondary}`}>Language</label>
                    <select className={inputClass}>
                      <option>English (US)</option>
                      <option>हिंदी</option>
                      <option>தமிழ்</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs mb-1 ${textSecondary}`}>Timezone</label>
                    <select className={inputClass}>
                      <option>IST (UTC+5:30)</option>
                      <option>UTC</option>
                      <option>EST (UTC-5)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

