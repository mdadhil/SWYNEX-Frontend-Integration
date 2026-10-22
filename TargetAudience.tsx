import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Globe, Heart, ShoppingBag, Smartphone, Tv, Coffee, Car, Plane, BookOpen, Music, Gamepad2, Check, Info, CheckCircle } from 'lucide-react';

const interests = [
  { id: 'tech', label: 'Technology', icon: Smartphone },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'sports', label: 'Sports', icon: Coffee },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'food', label: 'Food & Dining', icon: Coffee },
  { id: 'auto', label: 'Automobiles', icon: Car },
  { id: 'books', label: 'Books & Education', icon: BookOpen },
  { id: 'entertainment', label: 'Entertainment', icon: Tv },
];

const behaviors = [
  { id: 'freq_shop', label: 'Frequent Shoppers', desc: 'Users who shop 5+ times/month' },
  { id: 'mobile_users', label: 'Mobile Users', desc: 'Primary mobile device users' },
  { id: 'online_buyers', label: 'Online Buyers', desc: 'Active e-commerce consumers' },
  { id: 'premium', label: 'Premium Spenders', desc: 'High-value purchase history' },
  { id: 'brand_engage', label: 'Brand Engagers', desc: 'Users who interact with brands' },
  { id: 'travel_intent', label: 'Travel Intenders', desc: 'Recently searched travel' },
];

const states = ['Tamil Nadu', 'Maharashtra', 'Karnataka', 'Delhi', 'Gujarat', 'Rajasthan', 'West Bengal', 'Uttar Pradesh'];
const tncities: Record<string, string[]> = {
  'Tamil Nadu': ['Madurai', 'Chennai', 'Coimbatore', 'Salem', 'Tiruchirappalli', 'Tirunelveli'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Laxmi Nagar'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Noida'],
};

export default function TargetAudience() {
  const { darkMode } = useApp();
  const [ageMin, setAgeMin] = useState(22);
  const [ageMax, setAgeMax] = useState(45);
  const [gender, setGender] = useState('Both');
  const [country] = useState('India');
  const [state, setState] = useState('Tamil Nadu');
  const [city, setCity] = useState('Madurai');
  const [selectedInterests, setSelectedInterests] = useState(['tech', 'shopping']);
  const [selectedBehaviors, setSelectedBehaviors] = useState(['freq_shop', 'mobile_users']);
  const [language, setLanguage] = useState('Tamil');

  const cardBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
    }`;

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleBehavior = (id: string) => {
    setSelectedBehaviors(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch data from DB when the component mounts
    const fetchAudience = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch('http://localhost:5000/api/target-audience', { headers });
        if (response.ok) {
          const data = await response.json();
          if (data.age_min) setAgeMin(data.age_min);
          if (data.age_max) setAgeMax(data.age_max);
          if (data.gender) setGender(data.gender);
          if (data.location) {
            const parts = data.location.split(',');
            if (parts.length >= 2) {
              setCity(parts[0].trim());
              setState(parts[1].trim());
            }
          }
          if (data.interests && Array.isArray(data.interests)) {
            setSelectedInterests(data.interests);
          }
        }
      } catch (err) {
        console.error('Failed to load audience:', err);
      }
    };
    fetchAudience();
  }, []);

  const handleSaveAudience = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/target-audience', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          campaign_id: 1, // Defaulting to 1 for now
          age_min: ageMin,
          age_max: ageMax,
          gender: gender,
          location: `${city}, ${state}`,
          interests: selectedInterests
        })
      });

      if (response.ok || response.status === 201) {
        setToast(`Audience saved! Targeting ${gender.toLowerCase()} aged ${ageMin}–${ageMax} in ${city}, ${state} with ${selectedInterests.length} interest${selectedInterests.length !== 1 ? 's' : ''} and ${selectedBehaviors.length} behavior${selectedBehaviors.length !== 1 ? 's' : ''}.`);
      } else {
        setToast('Failed to save to database. Check console logs.');
      }
    } catch (err) {
      console.error('Save failed:', err);
      setToast('Network error saving audience.');
    }
    setTimeout(() => setToast(null), 4000);
  };

  const estReach = Math.round(((ageMax - ageMin) / 47) * (selectedInterests.length * 0.3 + selectedBehaviors.length * 0.2 + 1) * 450000);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={textPrimary} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Target Audience</h1>
          <p className={`text-sm mt-1 ${textSecondary}`}>Define who should see your ads</p>
        </div>
        <button
          onClick={handleSaveAudience}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
          style={{ fontWeight: 600 }}
        >
          <Check size={16} /> Save Audience
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${darkMode
          ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`} style={{ fontWeight: 500 }}>
          <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="xl:col-span-2 space-y-5">
          {/* Demographics */}
          <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Users size={16} className="text-indigo-600" />
              </div>
              <h3 className={textPrimary} style={{ fontWeight: 600 }}>Demographics</h3>
            </div>

            {/* Age Range */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Age Range</label>
                <span className="text-indigo-600 text-sm px-3 py-1 bg-indigo-50 rounded-full" style={{ fontWeight: 600 }}>{ageMin} – {ageMax} years</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={textSecondary}>Min Age: {ageMin}</span>
                    <span className={textSecondary}>18 – 65</span>
                  </div>
                  <input
                    type="range" min={18} max={65} value={ageMin}
                    onChange={e => setAgeMin(Math.min(Number(e.target.value), ageMax - 1))}
                    className="w-full h-2 rounded-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={textSecondary}>Max Age: {ageMax}</span>
                  </div>
                  <input
                    type="range" min={18} max={65} value={ageMax}
                    onChange={e => setAgeMax(Math.max(Number(e.target.value), ageMin + 1))}
                    className="w-full h-2 rounded-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="mb-5">
              <label className={`block text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Gender</label>
              <div className="flex gap-3">
                {['Male', 'Female', 'Both'].map(g => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setGender(g)}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${gender === g ? 'border-indigo-600 bg-indigo-600' : darkMode ? 'border-gray-600' : 'border-gray-300'
                        }`}
                    >
                      {gender === g && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className={inputClass}>
                {['Tamil', 'Hindi', 'English', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Globe size={16} className="text-emerald-600" />
              </div>
              <h3 className={textPrimary} style={{ fontWeight: 600 }}>Location Targeting</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Country</label>
                <select className={inputClass} defaultValue="India">
                  <option>India</option>
                  <option>UAE</option>
                  <option>Singapore</option>
                  <option>USA</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>State / Province</label>
                <select value={state} onChange={e => { setState(e.target.value); setCity(tncities[e.target.value]?.[0] || ''); }} className={inputClass}>
                  {states.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>City</label>
                <select value={city} onChange={e => setCity(e.target.value)} className={inputClass}>
                  {(tncities[state] || []).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                <Heart size={16} className="text-pink-600" />
              </div>
              <h3 className={textPrimary} style={{ fontWeight: 600 }}>Interests</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {interests.map(interest => {
                const selected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${selected
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : darkMode
                        ? 'border-gray-700 text-gray-400 hover:border-indigo-500 hover:bg-gray-800'
                        : 'border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    style={{ fontWeight: 500 }}
                  >
                    <interest.icon size={15} className={selected ? 'text-white' : 'text-indigo-500'} />
                    <span className="truncate">{interest.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Behaviors */}
          <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <ShoppingBag size={16} className="text-orange-600" />
              </div>
              <h3 className={textPrimary} style={{ fontWeight: 600 }}>Behavioral Targeting</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {behaviors.map(b => {
                const selected = selectedBehaviors.includes(b.id);
                return (
                  <label
                    key={b.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selected
                      ? darkMode ? 'border-indigo-500 bg-indigo-900/30' : 'border-indigo-300 bg-indigo-50'
                      : darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${selected ? 'bg-indigo-600 border-indigo-600' : darkMode ? 'border-gray-600' : 'border-gray-300'
                        }`}
                      onClick={() => toggleBehavior(b.id)}
                    >
                      {selected && <Check size={12} className="text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>{b.label}</p>
                      <p className={`text-xs mt-0.5 ${textSecondary}`}>{b.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Audience Summary */}
        <div className="space-y-4">
          {/* Estimated Reach */}
          <div className={`${cardBg} rounded-2xl border p-5`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <h3 className={`mb-4 ${textPrimary}`} style={{ fontWeight: 600 }}>Audience Estimate</h3>
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Users size={28} className="text-white" />
              </div>
              <p className="text-3xl mt-4 text-indigo-600" style={{ fontWeight: 700 }}>
                {estReach > 1000000
                  ? `${(estReach / 1000000).toFixed(1)}M`
                  : estReach > 1000
                    ? `${(estReach / 1000).toFixed(0)}K`
                    : estReach}
              </p>
              <p className={`text-sm mt-1 ${textSecondary}`}>Estimated Reach</p>

              {/* Meter */}
              <div className="mt-4">
                <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (estReach / 1500000) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className={textSecondary}>Too Narrow</span>
                  <span className="text-emerald-600" style={{ fontWeight: 500 }}>Optimal</span>
                  <span className={textSecondary}>Too Broad</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className={`${cardBg} rounded-2xl border p-5`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <h3 className={`mb-4 ${textPrimary}`} style={{ fontWeight: 600 }}>Targeting Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Age', value: `${ageMin}–${ageMax} years` },
                { label: 'Gender', value: gender },
                { label: 'Location', value: `${city}, ${state}` },
                { label: 'Language', value: language },
                { label: 'Interests', value: `${selectedInterests.length} selected` },
                { label: 'Behaviors', value: `${selectedBehaviors.length} selected` },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className={`text-sm ${textSecondary}`}>{item.label}</span>
                  <span className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-indigo-900/30 border-indigo-800' : 'bg-indigo-50 border-indigo-100'} border`}>
            <div className="flex gap-2">
              <Info size={15} className="text-indigo-600 flex-shrink-0 mt-0.5" />
              <p className={`text-xs ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                Selecting 3–5 interests and 2–3 behaviors gives the best balance between reach and relevance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

