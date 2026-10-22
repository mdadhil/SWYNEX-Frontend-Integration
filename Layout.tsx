import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Megaphone,
  PlusSquare,
  Users,
  CreditCard,
  Share2,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Bell,
  Moon,
  Sun,
  Zap,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Campaigns', path: '/campaigns', icon: Megaphone },
  { label: 'Create Ad', path: '/create-ad', icon: PlusSquare },
  { label: 'Target Audience', path: '/target-audience', icon: Users },
  { label: 'Budget & Billing', path: '/budget-billing', icon: CreditCard },
  { label: 'Social Media', path: '/social-media', icon: Share2 },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { darkMode, toggleDarkMode, user, setIsAuthenticated } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-slate-50 text-gray-900'}`}>
      {/* Top Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 lg:px-6 border-b ${darkMode
          ? 'bg-gray-900/95 backdrop-blur-md border-gray-800'
          : 'bg-white/95 backdrop-blur-md border-gray-200'
          } shadow-sm`}
      >
        {/* Left: Logo + Mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span
              className={`text-lg hidden sm:block ${darkMode ? 'text-white' : 'text-gray-900'}`}
              style={{ fontWeight: 700 }}
            >
              AdMaster
            </span>
          </Link>
        </div>

        {/* Center Nav - Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${active
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                style={{ fontWeight: active ? 600 : 400 }}
              >
                <item.icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm overflow-hidden" style={{ fontWeight: 600 }}>
                {user.avatar?.startsWith('http') ? <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar"/> : user.avatar}
              </div>
              <div className="hidden sm:block text-left">
                <p className={`text-sm leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontWeight: 600 }}>{user.name}</p>
                <p className={`text-xs leading-none mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.role}</p>
              </div>
              <ChevronDown size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </button>

            {profileOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-20 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                  }`}
              >
                <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontWeight: 600 }}>{user.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Settings size={15} /> Profile Settings
                </Link>
              </div>
            )}
            {profileOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-20 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                  }`}
              >
                <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontWeight: 600 }}>{user.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                </div>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-all ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Settings size={15} /> Profile Settings
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-all shadow-sm shrink-0"
            style={{ fontWeight: 600, width: "36px", height: "36px" }}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <nav
            className={`absolute left-0 top-16 bottom-0 w-64 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-white'
              } shadow-xl`}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 space-y-1">
              {navItems.map(item => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${active
                      ? 'bg-indigo-600 text-white'
                      : darkMode
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    style={{ fontWeight: active ? 600 : 400 }}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
