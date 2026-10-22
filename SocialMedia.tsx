import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Settings,
  Zap,
  TrendingUp,
  Users,
} from 'lucide-react';

const platformIcons: Record<string, React.ReactNode> = {
  YouTube: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  OLX: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <rect width="24" height="24" rx="4" fill="#FFC120" />
      <text x="4" y="17" fontSize="10" fontWeight="bold" fill="#002F34">OLX</text>
    </svg>
  ),
  Twitter: (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

const platformColors: Record<string, string> = {
  YouTube: '#FF0000',
  LinkedIn: '#0A66C2',
  Facebook: '#1877F2',
  Instagram: '#E1306C',
  OLX: '#FFC120',
  Twitter: '#000000',
};

const initialPlatforms = [
  { id: 'youtube', name: 'YouTube', connected: true, status: 'Active', followers: '12.4K', reach: '245K', lastSync: '5 min ago' },
  { id: 'linkedin', name: 'LinkedIn', connected: true, status: 'Active', followers: '8.2K', reach: '124K', lastSync: '12 min ago' },
  { id: 'facebook', name: 'Facebook', connected: true, status: 'Active', followers: '34.6K', reach: '890K', lastSync: '3 min ago' },
  { id: 'instagram', name: 'Instagram', connected: true, status: 'Active', followers: '52.1K', reach: '1.2M', lastSync: '1 min ago' },
  { id: 'olx', name: 'OLX', connected: false, status: 'Disconnected', followers: '—', reach: '—', lastSync: 'Never' },
  { id: 'twitter', name: 'Twitter', connected: false, status: 'Disconnected', followers: '—', reach: '—', lastSync: 'Never' },
];

export default function SocialMedia() {
  const { darkMode } = useApp();
  const [platforms, setPlatforms] = useState(initialPlatforms);
  const [syncing, setSyncing] = useState<string | null>(null);

  const cardBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';

  const handleToggle = (id: string) => {
    setPlatforms(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              connected: !p.connected,
              status: !p.connected ? 'Active' : 'Disconnected',
              followers: !p.connected ? 'Syncing...' : '—',
              lastSync: !p.connected ? 'Just now' : 'Never',
            }
          : p
      )
    );
  };

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 2000);
  };

  const connectedCount = platforms.filter(p => p.connected).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={textPrimary} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Social Media Platforms</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>{connectedCount} of {platforms.length} platforms connected</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25" style={{ fontWeight: 600 }}>
          <RefreshCw size={16} /> Sync All
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Connected Platforms', value: connectedCount, icon: Zap, color: 'indigo' },
          { label: 'Total Followers', value: '107.3K', icon: Users, color: 'emerald' },
          { label: 'Combined Reach', value: '2.46M', icon: TrendingUp, color: 'purple' },
        ].map((s, i) => (
          <div key={i} className={`${cardBg} rounded-2xl border p-5`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-800' : `bg-${s.color}-50`} flex items-center justify-center`}>
                <s.icon size={18} className={`text-${s.color}-600`} />
              </div>
              <div>
                <p className={`text-xl ${textPrimary}`} style={{ fontWeight: 700 }}>{s.value}</p>
                <p className={`text-xs ${textSecondary}`}>{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {platforms.map(platform => (
          <div
            key={platform.id}
            className={`${cardBg} rounded-2xl border overflow-hidden transition-all hover:shadow-md`}
            style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}
          >
            {/* Top color bar */}
            <div
              className="h-1.5"
              style={{ background: platform.connected ? platformColors[platform.name] : '#d1d5db' }}
            />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: platform.connected
                        ? `${platformColors[platform.name]}15`
                        : darkMode ? '#374151' : '#f9fafb',
                      color: platform.connected ? platformColors[platform.name] : '#9CA3AF',
                    }}
                  >
                    {platformIcons[platform.name]}
                  </div>
                  <div>
                    <p className={`${textPrimary}`} style={{ fontWeight: 600 }}>{platform.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${platform.connected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      <span className={`text-xs ${platform.connected ? 'text-emerald-600' : textSecondary}`} style={{ fontWeight: 500 }}>
                        {platform.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => handleToggle(platform.id)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                    platform.connected ? 'bg-indigo-600' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                      platform.connected ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Stats */}
              {platform.connected ? (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-lg ${textPrimary}`} style={{ fontWeight: 700 }}>{platform.followers}</p>
                    <p className={`text-xs ${textSecondary} mt-0.5`}>Followers</p>
                  </div>
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className={`text-lg ${textPrimary}`} style={{ fontWeight: 700 }}>{platform.reach}</p>
                    <p className={`text-xs ${textSecondary} mt-0.5`}>Monthly Reach</p>
                  </div>
                </div>
              ) : (
                <div className={`p-3 rounded-xl text-center mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${textSecondary}`}>Connect to see analytics</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${textSecondary}`}>
                  {platform.connected ? `Synced ${platform.lastSync}` : 'Not connected'}
                </span>
                <div className="flex items-center gap-1">
                  {platform.connected && (
                    <button
                      onClick={() => handleSync(platform.id)}
                      className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                      <RefreshCw size={14} className={syncing === platform.id ? 'animate-spin' : ''} />
                    </button>
                  )}
                  <button
                    className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <Settings size={14} />
                  </button>
                  {platform.connected && (
                    <button
                      className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* API Status */}
      <div className={`${cardBg} rounded-2xl border p-5`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}>
        <h3 className={`mb-4 ${textPrimary}`} style={{ fontWeight: 600 }}>API Integration Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {platforms.filter(p => p.connected).map(p => (
            <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>{p.name} API</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-600" />
                <span className="text-xs text-emerald-600" style={{ fontWeight: 500 }}>Operational</span>
              </div>
            </div>
          ))}
          {platforms.filter(p => !p.connected).map(p => (
            <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className={`text-sm ${textSecondary}`}>{p.name} API</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle size={14} className={textSecondary} />
                <span className={`text-xs ${textSecondary}`}>Inactive</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

