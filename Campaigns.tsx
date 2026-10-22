import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';



const allPlatforms = ['All Platforms', 'Instagram', 'LinkedIn', 'Facebook', 'OLX', 'Twitter', 'YouTube'];
const allStatuses = ['All Status', 'Active', 'Paused', 'Completed'];
const campaignPlatforms = ['Instagram', 'Facebook', 'LinkedIn', 'OLX', 'Twitter', 'YouTube'];

const emptyForm = { name: '', budget: '', platform: 'Instagram', status: 'Active', startDate: '' };

export default function Campaigns() {
  const { darkMode } = useApp();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('All Platforms');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/campaigns?per_page=100', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns);
      }
    } catch (err) { console.error('Failed to load campaigns:', err); }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);


  const cardBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${darkMode
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
    }`;
  const selectClass = `px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
    }`;

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.platform.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = filterPlatform === 'All Platforms' || c.platform === filterPlatform;
    const matchStatus = filterStatus === 'All Status' || c.status === filterStatus;
    return matchSearch && matchPlatform && matchStatus;
  });

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/campaigns/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCampaigns();
    } catch(err) { console.error(err); }
    setDeleteId(null);
  };

  const openModal = () => {
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const handleCreateCampaign = async () => {
    if (!form.name.trim()) { setFormError('Campaign name is required.'); return; }
    if (!form.budget.trim() || isNaN(Number(form.budget))) { setFormError('Please enter a valid budget amount.'); return; }

    const budgetNum = parseInt(form.budget, 10);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name.trim(),
          status: form.status,
          platform: form.platform,
          budget: budgetNum,
          spent: 0
        })
      });
      if (res.ok) {
        setShowModal(false);
        setForm(emptyForm);
        setFormError('');
        fetchCampaigns();
      } else {
        setFormError('Failed to create campaign');
      }
    } catch (err) { console.error(err); setFormError('Network error'); }
  };

  const statusColors: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-700',
    Paused: 'bg-amber-100 text-amber-700',
    Completed: 'bg-gray-100 text-gray-600',
  };
  const statusDotColors: Record<string, string> = {
    Active: 'bg-emerald-500',
    Paused: 'bg-amber-500',
    Completed: 'bg-gray-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={textPrimary} style={{ fontWeight: 700, fontSize: '1.5rem' }}>
            Campaigns
          </h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>
            {campaigns.length} total campaigns •{' '}
            {campaigns.filter((c) => c.status === 'Active').length} active
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25 text-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus size={17} /> Add Campaign
        </button>
      </div>

      {/* Filters */}
      <div
        className={`${cardBg} rounded-2xl border p-4 flex flex-col sm:flex-row gap-3`}
        style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className={`w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
          />
        </div>
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value)}
          className={selectClass}
        >
          {allPlatforms.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={selectClass}
        >
          {allStatuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        className={`${cardBg} rounded-2xl border overflow-hidden`}
        style={{
          boxShadow: darkMode
            ? 'none'
            : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${darkMode
                    ? 'border-gray-800 bg-gray-800/50'
                    : 'border-gray-100 bg-gray-50'
                  }`}
              >
                {[
                  'Campaign Name',
                  'Platform',
                  'Status',
                  'Budget',
                  'Spent',
                  'Impressions',
                  'CTR',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className={`text-left px-5 py-3.5 text-xs whitespace-nowrap ${textSecondary}`}
                    style={{ fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className={`border-b last:border-b-0 transition-colors ${darkMode
                      ? 'border-gray-800 hover:bg-gray-800/40'
                      : 'border-gray-50 hover:bg-gray-50'
                    }`}
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>
                        {c.name}
                      </p>
                      <p className={`text-xs ${textSecondary} mt-0.5`}>Started {new Date(c.created_at || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-sm ${textSecondary}`}>{c.platform}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${statusColors[c.status]}`}
                      style={{ fontWeight: 500 }}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDotColors[c.status]}`}
                      />
                      {c.status}
                    </span>
                  </td>
                  <td className={`px-5 py-4 text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>
                    {'₹' + Number(c.budget).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>
                        {'₹' + Number(c.spent).toLocaleString('en-IN')}
                      </p>
                      <div
                        className={`mt-1 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
                          } w-20 overflow-hidden`}
                      >
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width: `${Math.min(
                              100,
                              (Number(c.spent) /
                                Math.max(1, Number(c.budget))) *
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className={`px-5 py-4 text-sm ${textSecondary}`}>{c.impressions}</td>
                  <td className={`px-5 py-4 text-sm ${textSecondary}`}>{c.ctr}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        className={`p-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all ${textSecondary}`}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className={`p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all ${textSecondary}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteId(c.id)}
                        className={`p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all ${textSecondary}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className={`px-5 py-12 text-center ${textSecondary}`}>
                    No campaigns found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'
            }`}
        >
          <p className={`text-xs ${textSecondary}`}>
            Showing {filtered.length} of {campaigns.length} campaigns
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-xs transition-all ${p === 1
                    ? 'bg-indigo-600 text-white'
                    : darkMode
                      ? 'text-gray-400 hover:bg-gray-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                style={{ fontWeight: p === 1 ? 600 : 400 }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add Campaign Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              } shadow-2xl`}
          >
            <h3 className={textPrimary} style={{ fontWeight: 600, fontSize: '1.125rem' }}>
              Add New Campaign
            </h3>
            <p className={`text-sm mt-1 mb-5 ${textSecondary}`}>
              Fill in the details to create a new campaign
            </p>

            <div className="space-y-4">
              {/* Campaign Name */}
              <div>
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  style={{ fontWeight: 500 }}
                >
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Summer Sale 2026"
                  className={inputClass}
                />
              </div>

              {/* Budget */}
              <div>
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  style={{ fontWeight: 500 }}
                >
                  Budget (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.budget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, budget: e.target.value.replace(/\D/g, '') }))
                  }
                  placeholder="e.g., 50000"
                  type="text"
                  inputMode="numeric"
                  className={inputClass}
                />
              </div>

              {/* Platform + Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    style={{ fontWeight: 500 }}
                  >
                    Platform
                  </label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                    className={`w-full ${selectClass}`}
                  >
                    {campaignPlatforms.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    style={{ fontWeight: 500 }}
                  >
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className={`w-full ${selectClass}`}
                  >
                    <option>Active</option>
                    <option>Paused</option>
                  </select>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label
                  className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  style={{ fontWeight: 500 }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className={inputClass}
                />
              </div>

              {/* Validation error */}
              {formError && (
                <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setFormError('');
                }}
                className={`flex-1 py-2.5 rounded-xl border text-sm ${darkMode
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                style={{ fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
                style={{ fontWeight: 600 }}
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className={`w-full max-w-sm rounded-2xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              } shadow-2xl`}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className={`text-center ${textPrimary}`} style={{ fontWeight: 600 }}>
              Delete Campaign?
            </h3>
            <p className={`text-center text-sm mt-2 mb-5 ${textSecondary}`}>
              This action cannot be undone. The campaign and all its data will be permanently
              removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className={`flex-1 py-2.5 rounded-xl border text-sm ${darkMode
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                style={{ fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 transition-all"
                style={{ fontWeight: 600 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

