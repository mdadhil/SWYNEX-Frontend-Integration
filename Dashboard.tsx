import React from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  MousePointerClick,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';

const weeklyData = [
  { day: 'Mon', impressions: 42000, clicks: 1820, conversions: 245 },
  { day: 'Tue', impressions: 58000, clicks: 2340, conversions: 312 },
  { day: 'Wed', impressions: 51000, clicks: 2150, conversions: 289 },
  { day: 'Thu', impressions: 67000, clicks: 2890, conversions: 378 },
  { day: 'Fri', impressions: 73000, clicks: 3120, conversions: 421 },
  { day: 'Sat', impressions: 61000, clicks: 2560, conversions: 334 },
  { day: 'Sun', impressions: 45000, clicks: 1940, conversions: 261 },
];

const platformData = [
  { name: 'Instagram', value: 35, color: '#E1306C' },
  { name: 'Facebook', value: 25, color: '#a01363ff' },
  { name: 'OLX', value: 15, color: '#FFC120' },
  { name: 'LinkedIn', value: 15, color: '#0A66C2' },
  { name: 'Twitter', value: 10, color: '#a61ad8ff' },
];

const recentCampaigns = [
  { name: 'Summer Sale 2026', platform: 'Instagram', status: 'Active', spend: '₹24,500', impressions: '1.2M', ctr: '3.4%' },
  { name: 'Tech Launch Q1', platform: 'LinkedIn', status: 'Active', spend: '₹18,200', impressions: '890K', ctr: '2.8%' },
  { name: 'Brand Awareness', platform: 'Facebook', status: 'Paused', spend: '₹12,800', impressions: '2.1M', ctr: '1.9%' },
  { name: 'Flash Sale', platform: 'OLX', status: 'Active', spend: '₹8,400', impressions: '456K', ctr: '4.1%' },
];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const { darkMode } = useApp();

  const handleExport = () => {
    const rows = [
      ['AdMaster Dashboard Export'],
      ['Generated:', new Date().toLocaleString()],
      [],
      ['--- Key Metrics ---'],
      ['Metric', 'Value', 'Change vs Last Week'],
      ['Total Impressions', '4,820,000', '+18.2%'],
      ['Total Clicks', '218,450', '+12.5%'],
      ['Avg. CPC', '₹8.42', '-5.1%'],
      ['Active Users', '64,218', '+24.8%'],
      [],
      ['--- Recent Campaigns ---'],
      ['Campaign', 'Platform', 'Status', 'Total Spend', 'Impressions', 'CTR'],
      ...recentCampaigns.map(c => [c.name, c.platform, c.status, c.spend, c.impressions, c.ctr]),
      [],
      ['--- Weekly Performance ---'],
      ['Day', 'Impressions', 'Clicks', 'Conversions'],
      ...weeklyData.map(d => [d.day, d.impressions, d.clicks, d.conversions]),
    ];
    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admaster-dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cardBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const chartBg = darkMode ? '#111827' : '#ffffff';
  const gridColor = darkMode ? '#374151' : '#f3f4f6';
  const axisColor = darkMode ? '#6B7280' : '#9CA3AF';

  const stats = [
    {
      label: 'Total Impressions',
      value: '4.82M',
      change: '+18.2%',
      positive: true,
      icon: Activity,
      gradient: 'from-indigo-500 to-purple-500',
      bg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Total Clicks',
      value: '218,450',
      change: '+12.5%',
      positive: true,
      icon: MousePointerClick,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Avg. CPC',
      value: '₹8.42',
      change: '-5.1%',
      positive: false,
      icon: DollarSign,
      gradient: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Active Users',
      value: '64,218',
      change: '+24.8%',
      positive: true,
      icon: Users,
      gradient: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={textPrimary} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Dashboard Overview</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>Welcome back! Here's what's happening with your ads.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className={`text-sm px-3 py-2 rounded-lg border outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button onClick={handleExport} className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg hover:opacity-90 transition-all" style={{ fontWeight: 500 }}>
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${cardBg} rounded-2xl border p-5 relative overflow-hidden`}
            style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 translate-x-6 -translate-y-6`} />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className={`text-xs ${textSecondary} mb-2`} style={{ fontWeight: 500 }}>{stat.label}</p>
                <p className={`text-2xl ${textPrimary}`} style={{ fontWeight: 700 }}>{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-xs ${stat.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  <span style={{ fontWeight: 500 }}>{stat.change}</span>
                  <span className={textSecondary}>vs last week</span>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-800' : stat.bg} flex items-center justify-center`}>
                <stat.icon size={18} className={stat.iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Performance Overview - Line Chart */}
        <div
          className={`${cardBg} rounded-2xl border p-6 xl:col-span-2`}
          style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={textPrimary} style={{ fontWeight: 600 }}>Performance Overview</h3>
              <p className={`text-xs mt-0.5 ${textSecondary}`}>Weekly impressions, clicks & conversions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className={`text-xs ${textSecondary}`}>Impressions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className={`text-xs ${textSecondary}`}>Clicks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className={`text-xs ${textSecondary}`}>Conversions</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip
                contentStyle={{ background: chartBg, border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ fontWeight: 600, color: darkMode ? '#fff' : '#111827' }}
              />
              <Line type="monotone" dataKey="impressions" stroke="#6366F1" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="conversions" stroke="#F97316" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution - Pie Chart */}
        <div
          className={`${cardBg} rounded-2xl border p-6`}
          style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-4">
            <h3 className={textPrimary} style={{ fontWeight: 600 }}>Platform Distribution</h3>
            <p className={`text-xs mt-0.5 ${textSecondary}`}>Ad spend by platform</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Share']} contentStyle={{ background: chartBg, border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {platformData.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className={`text-xs ${textSecondary}`}>{p.name}</span>
                </div>
                <span className={`text-xs ${textPrimary}`} style={{ fontWeight: 600 }}>{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div
        className={`${cardBg} rounded-2xl border`}
        style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className={textPrimary} style={{ fontWeight: 600 }}>Active Campaigns</h3>
            <p className={`text-xs mt-0.5 ${textSecondary}`}>Your top performing campaigns this week</p>
          </div>
          <a href="/campaigns" className="text-indigo-600 text-sm hover:text-indigo-700" style={{ fontWeight: 500 }}>View All →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'border-b border-gray-800' : 'border-b border-gray-100'}>
                {['Campaign', 'Platform', 'Status', 'Total Spend', 'Impressions', 'CTR'].map(h => (
                  <th key={h} className={`text-left px-6 py-3 text-xs ${textSecondary}`} style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map((c, i) => (
                <tr key={i} className={`border-b last:border-b-0 ${darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50'} transition-colors`}>
                  <td className={`px-6 py-4 text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>{c.name}</td>
                  <td className={`px-6 py-4 text-sm ${textSecondary}`}>{c.platform}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${c.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                      }`} style={{ fontWeight: 500 }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {c.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>{c.spend}</td>
                  <td className={`px-6 py-4 text-sm ${textSecondary}`}>{c.impressions}</td>
                  <td className={`px-6 py-4 text-sm ${textSecondary}`}>{c.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

