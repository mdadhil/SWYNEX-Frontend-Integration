import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Download, TrendingUp, TrendingDown, BarChart3, Filter } from 'lucide-react';

const monthlyData2026 = [
  { month: 'Jan', revenue: 185000, cost: 72000, profit: 113000, clicks: 18400, impressions: 920000 },
  { month: 'Feb', revenue: 210000, cost: 84000, profit: 126000, clicks: 21000, impressions: 1050000 },
  { month: 'Mar', revenue: 245000, cost: 96000, profit: 149000, clicks: 24500, impressions: 1225000 },
  { month: 'Apr', revenue: 198000, cost: 78000, profit: 120000, clicks: 19800, impressions: 990000 },
  { month: 'May', revenue: 312000, cost: 120000, profit: 192000, clicks: 31200, impressions: 1560000 },
  { month: 'Jun', revenue: 278000, cost: 108000, profit: 170000, clicks: 27800, impressions: 1390000 },
  { month: 'Jul', revenue: 334000, cost: 128000, profit: 206000, clicks: 33400, impressions: 1670000 },
  { month: 'Aug', revenue: 295000, cost: 114000, profit: 181000, clicks: 29500, impressions: 1475000 },
  { month: 'Sep', revenue: 356000, cost: 136000, profit: 220000, clicks: 35600, impressions: 1780000 },
  { month: 'Oct', revenue: 389000, cost: 148000, profit: 241000, clicks: 38900, impressions: 1945000 },
  { month: 'Nov', revenue: 421000, cost: 162000, profit: 259000, clicks: 42100, impressions: 2105000 },
  { month: 'Dec', revenue: 478000, cost: 184000, profit: 294000, clicks: 47800, impressions: 2390000 },
];

const formatINR = (val: number) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

const CustomTooltip = ({ active, payload, label, darkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-xl shadow-xl border p-3 text-sm ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}
      >
        <p className={darkMode ? 'text-white font-semibold mb-2' : 'text-gray-900 font-semibold mb-2'}>{label} 2026</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 py-0.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{p.name}:</span>
            <span style={{ color: p.color, fontWeight: 600 }}>
              {p.name === 'Clicks' || p.name === 'Impressions'
                ? p.value.toLocaleString()
                : formatINR(p.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { darkMode } = useApp();
  const [year, setYear] = useState('2026');
  const [chartType, setChartType] = useState<'revenue' | 'performance'>('revenue');

  const handleExportCSV = () => {
    const rows = [
      ['Month', 'Revenue', 'Cost', 'Profit', 'Clicks', 'Impressions'],
      ...monthlyData2026.map(row => [row.month, row.revenue, row.cost, row.profit, row.clicks, row.impressions]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admaster-reports-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cardBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const gridColor = darkMode ? '#374151' : '#f3f4f6';
  const axisColor = darkMode ? '#6B7280' : '#9CA3AF';

  const totalRevenue = monthlyData2026.reduce((s, d) => s + d.revenue, 0);
  const totalCost = monthlyData2026.reduce((s, d) => s + d.cost, 0);
  const totalProfit = monthlyData2026.reduce((s, d) => s + d.profit, 0);
  const totalClicks = monthlyData2026.reduce((s, d) => s + d.clicks, 0);
  const roi = ((totalProfit / totalCost) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={textPrimary} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Reports & Analytics</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>Yearly performance overview and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className={`px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-700'
              }`}
          >
            {['2026', '2025', '2024'].map(y => <option key={y}>{y}</option>)}
          </select>
          <button onClick={() => alert('Filter options coming soon!')} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm transition-all ${darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`} style={{ fontWeight: 500 }}>
            <Filter size={14} /> Filter
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 shadow-lg shadow-indigo-500/25" style={{ fontWeight: 600 }}>
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          { label: 'Total Revenue', value: formatINR(totalRevenue), change: '+34.2%', positive: true },
          { label: 'Total Cost', value: formatINR(totalCost), change: '+21.8%', positive: false },
          { label: 'Net Profit', value: formatINR(totalProfit), change: '+42.6%', positive: true },
          { label: 'Total Clicks', value: `${(totalClicks / 1000).toFixed(0)}K`, change: '+28.4%', positive: true },
          { label: 'Avg. ROI', value: `${roi}%`, change: '+18.1%', positive: true },
        ].map((s, i) => (
          <div key={i} className={`${cardBg} rounded-2xl border p-4`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}>
            <p className={`text-xs ${textSecondary} mb-1`} style={{ fontWeight: 500 }}>{s.label}</p>
            <p className={`text-xl ${textPrimary}`} style={{ fontWeight: 700 }}>{s.value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs ${s.positive ? 'text-emerald-600' : 'text-red-500'}`}>
              {s.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span style={{ fontWeight: 500 }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={textPrimary} style={{ fontWeight: 600 }}>
              {chartType === 'revenue' ? 'Revenue vs Cost — ' : 'Clicks & Impressions — '}
              {year}
            </h3>
            <p className={`text-xs mt-0.5 ${textSecondary}`}>Monthly breakdown across all campaigns</p>
          </div>
          <div className={`flex items-center p-1 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {[
              { key: 'revenue', label: 'Revenue' },
              { key: 'performance', label: 'Performance' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setChartType(tab.key as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs transition-all ${chartType === tab.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                  }`}
                style={{ fontWeight: chartType === tab.key ? 600 : 400 }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          {chartType === 'revenue' ? (
            <AreaChart data={monthlyData2026}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatINR} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                iconType="circle"
                iconSize={8}
              />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="cost" name="Cost" stroke="#F97316" strokeWidth={2.5} fill="url(#costGrad)" dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="profit" name="Profit" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 5 }} strokeDasharray="5 3" />
            </AreaChart>
          ) : (
            <BarChart data={monthlyData2026}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} iconType="circle" iconSize={8} />
              <Bar dataKey="clicks" name="Clicks" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="impressions" name="Impressions" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className={`${cardBg} rounded-2xl border overflow-hidden`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className={textPrimary} style={{ fontWeight: 600 }}>Monthly Breakdown — {year}</h3>
          <button onClick={handleExportCSV} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`} style={{ fontWeight: 500 }}>
            <Download size={12} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                {['Month', 'Revenue', 'Cost', 'Profit', 'ROI', 'Clicks', 'Impressions'].map(h => (
                  <th key={h} className={`text-left px-5 py-3 text-xs ${textSecondary}`} style={{ fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyData2026.map((row, i) => {
                const rowRoi = ((row.profit / row.cost) * 100).toFixed(0);
                return (
                  <tr
                    key={i}
                    className={`border-b last:border-b-0 transition-colors ${darkMode ? 'border-gray-800 hover:bg-gray-800/40' : 'border-gray-50 hover:bg-gray-50'
                      }`}
                  >
                    <td className={`px-5 py-3.5 text-sm ${textPrimary}`} style={{ fontWeight: 600 }}>{row.month}</td>
                    <td className="px-5 py-3.5 text-sm text-indigo-600" style={{ fontWeight: 600 }}>{formatINR(row.revenue)}</td>
                    <td className="px-5 py-3.5 text-sm text-orange-600" style={{ fontWeight: 600 }}>{formatINR(row.cost)}</td>
                    <td className="px-5 py-3.5 text-sm text-emerald-600" style={{ fontWeight: 600 }}>{formatINR(row.profit)}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full" style={{ fontWeight: 600 }}>
                        {rowRoi}%
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-sm ${textSecondary}`}>{row.clicks.toLocaleString()}</td>
                    <td className={`px-5 py-3.5 text-sm ${textSecondary}`}>{(row.impressions / 1000).toFixed(0)}K</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className={`border-t-2 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                <td className={`px-5 py-3.5 text-sm ${textPrimary}`} style={{ fontWeight: 700 }}>Total</td>
                <td className="px-5 py-3.5 text-sm text-indigo-600" style={{ fontWeight: 700 }}>{formatINR(totalRevenue)}</td>
                <td className="px-5 py-3.5 text-sm text-orange-600" style={{ fontWeight: 700 }}>{formatINR(totalCost)}</td>
                <td className="px-5 py-3.5 text-sm text-emerald-600" style={{ fontWeight: 700 }}>{formatINR(totalProfit)}</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full" style={{ fontWeight: 700 }}>{roi}%</span>
                </td>
                <td className={`px-5 py-3.5 text-sm ${textSecondary}`} style={{ fontWeight: 700 }}>{(totalClicks / 1000).toFixed(0)}K</td>
                <td className={`px-5 py-3.5 text-sm ${textSecondary}`} style={{ fontWeight: 700 }}>
                  {(monthlyData2026.reduce((s, d) => s + d.impressions, 0) / 1000000).toFixed(1)}M
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

