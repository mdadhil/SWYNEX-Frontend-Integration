import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  Download,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Plus,
  Wallet,
  Clock,
  X,
} from 'lucide-react';

const initialBillingHistory = [
  { id: 'INV-2026-031', date: 'Mar 01, 2026', amount: '₹24,500', status: 'Paid', desc: 'Campaign: Summer Sale 2026' },
  { id: 'INV-2026-028', date: 'Feb 25, 2026', amount: '₹18,200', status: 'Paid', desc: 'Campaign: Tech Product Launch' },
  { id: 'INV-2026-022', date: 'Feb 15, 2026', amount: '₹12,800', status: 'Paid', desc: 'Campaign: Brand Awareness Drive' },
  { id: 'INV-2026-019', date: 'Feb 08, 2026', amount: '₹8,400', status: 'Paid', desc: 'Campaign: Flash Weekend Sale' },
  { id: 'INV-2026-012', date: 'Jan 28, 2026', amount: '₹31,600', status: 'Paid', desc: 'Campaign: January Promotions' },
  { id: 'INV-2026-008', date: 'Jan 15, 2026', amount: '₹9,800', status: 'Failed', desc: 'Campaign: App Download Push' },
  { id: 'INV-2026-003', date: 'Jan 05, 2026', amount: '₹15,400', status: 'Pending', desc: 'Campaign: New Year Campaign' },
];

const paymentMethods = [
  { type: 'Visa', last4: '4242', expiry: '08/28', brand: 'VISA', primary: true },
  { type: 'Mastercard', last4: '8832', expiry: '12/27', brand: 'MC', primary: false },
];

type Toast = { type: 'success' | 'error'; message: string };

export default function BudgetBilling() {
  const { darkMode } = useApp();
  const [budget, setBudget] = useState('50000');
  const [dailyBudget, setDailyBudget] = useState('2000');
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const cardBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
    }`;

  const statusColors: Record<string, string> = {
    Paid: 'bg-emerald-100 text-emerald-700',
    Failed: 'bg-red-100 text-red-600',
    Pending: 'bg-amber-100 text-amber-700',
  };

  const totalSpend = 120700;
  const totalBudget = 250000;
  const spendPercent = (totalSpend / totalBudget) * 100;

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Add Funds ──
  const handleAddFunds = () => {
    const amt = parseInt(fundsAmount.replace(/\D/g, ''), 10);
    if (!fundsAmount || isNaN(amt) || amt <= 0) {
      showToast('error', 'Please enter a valid amount to add.');
      return;
    }
    setAddFundsOpen(false);
    setFundsAmount('');
    showToast('success', `₹${amt.toLocaleString('en-IN')} added to your wallet successfully!`);
  };

  // ── Export CSV ──
  const handleExportCSV = () => {
    const rows = [
      ['Invoice', 'Date', 'Description', 'Amount', 'Status'],
      ...initialBillingHistory.map(inv => [inv.id, inv.date, inv.desc, inv.amount, inv.status]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admaster-billing-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Billing history exported as CSV!');
  };

  // ── Download single invoice ──
  const handleDownloadInvoice = (inv: typeof initialBillingHistory[0]) => {
    const content = [
      'AdMaster Invoice',
      '================',
      `Invoice ID : ${inv.id}`,
      `Date       : ${inv.date}`,
      `Description: ${inv.desc}`,
      `Amount     : ${inv.amount}`,
      `Status     : ${inv.status}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', `Invoice ${inv.id} downloaded!`);
  };

  // ── Update Settings ──
  const handleUpdateSettings = () => {
    if (!budget || parseInt(budget) <= 0) {
      showToast('error', 'Please enter a valid monthly budget.');
      return;
    }
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
    showToast('success', `Budget updated — Monthly: ₹${parseInt(budget).toLocaleString('en-IN')}, Daily limit: ₹${parseInt(dailyBudget).toLocaleString('en-IN')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={textPrimary} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Budget & Billing</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>Manage your ad spending and payment methods</p>
        </div>
        <button
          onClick={() => setAddFundsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} /> Add Funds
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${toast.type === 'success'
            ? darkMode ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : darkMode ? 'bg-red-900/40 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-600'
            }`}
          style={{ fontWeight: 500 }}
        >
          {toast.type === 'success' ? <CheckCircle size={16} className="flex-shrink-0" /> : <AlertCircle size={16} className="flex-shrink-0" />}
          {toast.message}
        </div>
      )}

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Budget', value: '₹2,50,000', sub: 'Monthly allocation', icon: Wallet, color: 'indigo', bg: 'from-indigo-500 to-purple-500' },
          { label: 'Total Spent', value: '₹1,20,700', sub: '48.3% utilized', icon: TrendingUp, color: 'emerald', bg: 'from-emerald-500 to-teal-500' },
          { label: 'Remaining', value: '₹1,29,300', sub: '51.7% remaining', icon: DollarSign, color: 'blue', bg: 'from-blue-500 to-cyan-500' },
          { label: 'Daily Avg. Spend', value: '₹4,025', sub: 'This month', icon: Clock, color: 'orange', bg: 'from-orange-500 to-amber-500' },
        ].map((item, i) => (
          <div
            key={i}
            className={`${cardBg} rounded-2xl border p-5 relative overflow-hidden`}
            style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}
          >
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${item.bg} opacity-10 translate-x-4 -translate-y-4`} />
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs ${textSecondary} mb-1`} style={{ fontWeight: 500 }}>{item.label}</p>
                <p className={`text-xl ${textPrimary}`} style={{ fontWeight: 700 }}>{item.value}</p>
                <p className={`text-xs mt-1 ${textSecondary}`}>{item.sub}</p>
              </div>
              <div className={`w-9 h-9 rounded-xl ${darkMode ? 'bg-gray-800' : `bg-${item.color}-50`} flex items-center justify-center`}>
                <item.icon size={16} className={`text-${item.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spend Progress */}
      <div className={`${cardBg} rounded-2xl border p-5`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}>
        <div className="flex justify-between items-center mb-3">
          <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 600 }}>Monthly Budget Utilization</p>
          <p className={`text-sm ${textSecondary}`}>{spendPercent.toFixed(1)}% used</p>
        </div>
        <div className={`w-full h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div
            className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
            style={{ width: `${spendPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${textSecondary}`}>₹0</span>
          <span className={`text-xs ${textSecondary}`}>₹1,20,700 spent</span>
          <span className={`text-xs ${textSecondary}`}>₹2,50,000</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Budget Settings */}
        <div className="xl:col-span-1 space-y-5">
          <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}>
            <h3 className={`mb-4 ${textPrimary}`} style={{ fontWeight: 600 }}>Budget Settings</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Monthly Budget (₹)</label>
                <input type="number" value={budget} onChange={e => setBudget(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Daily Spending Limit (₹)</label>
                <input type="number" value={dailyBudget} onChange={e => setDailyBudget(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Billing Cycle</label>
                <select className={inputClass}>
                  <option>Monthly (1st of each month)</option>
                  <option>Weekly (Every Monday)</option>
                  <option>Per Campaign</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Alert Threshold</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="80" defaultValue={80} className={`${inputClass} flex-1`} />
                  <span className={`flex items-center px-3 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-400 bg-gray-800' : 'border-gray-200 text-gray-500 bg-gray-50'}`}>%</span>
                </div>
              </div>
              <button
                onClick={handleUpdateSettings}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                {settingsSaved ? <><CheckCircle size={15} /> Saved!</> : 'Update Settings'}
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07)' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={textPrimary} style={{ fontWeight: 600 }}>Payment Methods</h3>
              <button onClick={() => setAddCardOpen(!addCardOpen)} className="text-indigo-600 text-xs hover:text-indigo-700" style={{ fontWeight: 500 }}>+ Add Card</button>
            </div>
            <div className="space-y-3">
              {paymentMethods.map((card, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition-all ${card.primary
                    ? darkMode ? 'border-indigo-500 bg-indigo-900/20' : 'border-indigo-300 bg-indigo-50'
                    : darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-7 rounded flex items-center justify-center text-xs ${card.brand === 'VISA' ? 'bg-blue-600 text-white' : 'bg-red-500 text-white'}`} style={{ fontWeight: 700 }}>
                        {card.brand}
                      </div>
                      <div>
                        <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>•••• •••• •••• {card.last4}</p>
                        <p className={`text-xs ${textSecondary}`}>Expires {card.expiry}</p>
                      </div>
                    </div>
                    {card.primary && (
                      <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full" style={{ fontWeight: 500 }}>Default</span>
                    )}
                  </div>
                </div>
              ))}
              {addCardOpen && (
                <div className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                  <input placeholder="Card Number" className={`${inputClass} mb-2`} />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="MM/YY" className={inputClass} />
                    <input placeholder="CVV" className={inputClass} />
                  </div>
                  <button
                    onClick={() => { setAddCardOpen(false); showToast('success', 'Card added successfully!'); }}
                    className="w-full mt-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                    style={{ fontWeight: 500 }}
                  >
                    Add Card
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="xl:col-span-2">
          <div className={`${cardBg} rounded-2xl border`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className={textPrimary} style={{ fontWeight: 600 }}>Billing History</h3>
              <button
                onClick={handleExportCSV}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${darkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                style={{ fontWeight: 500 }}
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                    {['Invoice', 'Date', 'Description', 'Amount', 'Status', ''].map(h => (
                      <th key={h} className={`text-left px-5 py-3 text-xs ${textSecondary}`} style={{ fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {initialBillingHistory.map((inv) => (
                    <tr
                      key={inv.id}
                      className={`border-b last:border-b-0 transition-colors ${darkMode ? 'border-gray-800 hover:bg-gray-800/40' : 'border-gray-50 hover:bg-gray-50'
                        }`}
                    >
                      <td className="px-5 py-4">
                        <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>{inv.id}</p>
                      </td>
                      <td className={`px-5 py-4 text-sm ${textSecondary} whitespace-nowrap`}>{inv.date}</td>
                      <td className={`px-5 py-4 text-sm ${textSecondary} max-w-xs truncate`}>{inv.desc}</td>
                      <td className={`px-5 py-4 text-sm ${textPrimary} whitespace-nowrap`} style={{ fontWeight: 600 }}>{inv.amount}</td>
                      <td className="px-5 py-4">
                        <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs ${statusColors[inv.status]}`} style={{ fontWeight: 500 }}>
                          {inv.status === 'Paid' ? <CheckCircle size={11} /> : inv.status === 'Failed' ? <AlertCircle size={11} /> : <Clock size={11} />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          className={`text-xs ${textSecondary} hover:text-indigo-600 transition-colors`}
                          title={`Download ${inv.id}`}
                        >
                          <Download size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {addFundsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl border p-6 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={textPrimary} style={{ fontWeight: 600, fontSize: '1.1rem' }}>Add Funds</h3>
              <button onClick={() => setAddFundsOpen(false)} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <X size={18} />
              </button>
            </div>
            <p className={`text-sm mb-4 ${textSecondary}`}>Enter the amount you want to add to your wallet.</p>

            <div className="mb-4">
              <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Amount (₹)</label>
              <input
                type="text"
                inputMode="numeric"
                value={fundsAmount}
                onChange={e => setFundsAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g., 10000"
                className={inputClass}
                autoFocus
              />
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mb-5">
              {['5000', '10000', '25000', '50000'].map(amt => (
                <button
                  key={amt}
                  onClick={() => setFundsAmount(amt)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${fundsAmount === amt
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : darkMode ? 'border-gray-700 text-gray-400 hover:border-indigo-500' : 'border-gray-200 text-gray-600 hover:border-indigo-400'
                    }`}
                  style={{ fontWeight: 500 }}
                >
                  ₹{parseInt(amt).toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setAddFundsOpen(false); setFundsAmount(''); }}
                className={`flex-1 py-2.5 rounded-xl border text-sm ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                style={{ fontWeight: 500 }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddFunds}
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 transition-all"
                style={{ fontWeight: 600 }}
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

