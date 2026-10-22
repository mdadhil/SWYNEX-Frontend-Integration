import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Smartphone, Monitor, Image, X, Check, CheckCircle, AlertCircle } from 'lucide-react';

const ctaOptions = ['Learn More', 'Shop Now', 'Sign Up', 'Get Offer', 'Download', 'Contact Us', 'Book Now', 'Watch More'];
const adPlacements = ['Feed', 'Stories', 'Reels', 'Explore', 'Search'];

export default function CreateAd() {
  const { darkMode } = useApp();
  const [headline, setHeadline] = useState('Discover Amazing Deals This Season!');
  const [primaryText, setPrimaryText] = useState('Shop the best collection with up to 50% off on all products. Limited time offer – don\'t miss out!');
  const [cta, setCta] = useState('Shop Now');
  const [platform, setPlatform] = useState('Instagram');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [dragging, setDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPlacements, setSelectedPlacements] = useState(['Feed', 'Stories']);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [destinationUrl, setDestinationUrl] = useState('');

  const cardBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = `w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
    }`;

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveDraft = () => {
    if (!headline.trim()) {
      showToast('error', 'Please add a headline before saving the draft.');
      return;
    }
    showToast('success', `Draft "${headline.slice(0, 30)}${headline.length > 30 ? '…' : ''}" saved successfully!`);
  };

  const handlePublish = () => {
    if (!headline.trim()) {
      showToast('error', 'A headline is required to publish your ad.');
      return;
    }
    if (!primaryText.trim()) {
      showToast('error', 'Primary text is required to publish your ad.');
      return;
    }
    showToast('success', `Ad "${headline.slice(0, 30)}${headline.length > 30 ? '…' : ''}" published on ${platform}!`);
  };

  const togglePlacement = (p: string) => {
    setSelectedPlacements(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={textPrimary} style={{ fontWeight: 700, fontSize: '1.5rem' }}>Create Ad</h1>
        <p className={`text-sm mt-1 ${textSecondary}`}>Build your ad creative and preview in real-time</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: Form */}
        <div className="xl:col-span-3 space-y-5">
          {/* Campaign Settings */}
          <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <h3 className={`mb-4 ${textPrimary}`} style={{ fontWeight: 600 }}>Campaign Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Platform</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className={inputClass}>
                  {['Instagram', 'Facebook', 'LinkedIn', 'OLX', 'Twitter', 'YouTube'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Objective</label>
                <select className={inputClass}>
                  {['Brand Awareness', 'Traffic', 'Conversions', 'App Downloads', 'Lead Generation'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Ad Creative */}
          <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <h3 className={`mb-4 ${textPrimary}`} style={{ fontWeight: 600 }}>Ad Creative</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>
                  Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  maxLength={100}
                  placeholder="Write a compelling headline..."
                  className={inputClass}
                />
                <p className={`text-xs mt-1 text-right ${headline.length > 80 ? 'text-amber-500' : textSecondary}`}>{headline.length}/100</p>
              </div>

              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>
                  Primary Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={primaryText}
                  onChange={e => setPrimaryText(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Write your ad copy here..."
                  className={`${inputClass} resize-none`}
                />
                <p className={`text-xs mt-1 text-right ${primaryText.length > 400 ? 'text-amber-500' : textSecondary}`}>{primaryText.length}/500</p>
              </div>

              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>
                  Call to Action
                </label>
                <select value={cta} onChange={e => setCta(e.target.value)} className={inputClass}>
                  {ctaOptions.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>
                  Destination URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-website.com/landing-page"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className={`${cardBg} rounded-2xl border p-6`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <h3 className={`mb-4 ${textPrimary}`} style={{ fontWeight: 600 }}>Media</h3>
            {uploadedImage ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={uploadedImage} alt="Uploaded" className="w-full h-48 object-cover" />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = ev => setUploadedImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragging
                  ? 'border-indigo-500 bg-indigo-50'
                  : darkMode
                    ? 'border-gray-700 hover:border-indigo-500 hover:bg-gray-800'
                    : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Upload size={20} className="text-indigo-500" />
                </div>
                <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 500 }}>Drag & drop your media here</p>
                <p className={`text-xs mt-1 ${textSecondary}`}>or click to browse • JPG, PNG, GIF, MP4 • Max 50MB</p>
                <label className="mt-3 inline-block">
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => setUploadedImage(ev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <span className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 cursor-pointer" style={{ fontWeight: 500 }}>Browse Files</span>
                </label>
              </div>
            )}

            {/* Placements */}
            <div className="mt-4">
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>Ad Placements</p>
              <div className="flex flex-wrap gap-2">
                {adPlacements.map(p => (
                  <button
                    key={p}
                    onClick={() => togglePlacement(p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${selectedPlacements.includes(p)
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : darkMode
                        ? 'border-gray-700 text-gray-400 hover:border-indigo-500'
                        : 'border-gray-200 text-gray-600 hover:border-indigo-400'
                      }`}
                    style={{ fontWeight: 500 }}
                  >
                    {selectedPlacements.includes(p) && <Check size={11} />}
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              className={`px-6 py-3 rounded-xl border text-sm transition-all ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              style={{ fontWeight: 500 }}
            >
              Save Draft
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
              style={{ fontWeight: 600 }}
            >
              Publish Ad
            </button>
          </div>

          {/* Toast notification */}
          {toast && (
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${toast.type === 'success'
                  ? darkMode
                    ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : darkMode
                    ? 'bg-red-900/40 border-red-700 text-red-300'
                    : 'bg-red-50 border-red-200 text-red-600'
                }`}
              style={{ fontWeight: 500 }}
            >
              {toast.type === 'success'
                ? <CheckCircle size={16} className="flex-shrink-0" />
                : <AlertCircle size={16} className="flex-shrink-0" />}
              {toast.message}
            </div>
          )}
        </div>

        {/* Right: Live Preview */}
        <div className="xl:col-span-2">
          <div className={`${cardBg} rounded-2xl border p-6 sticky top-24`} style={{ boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={textPrimary} style={{ fontWeight: 600 }}>Live Preview</h3>
              <div className={`flex items-center p-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${previewMode === 'mobile'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  style={{ fontWeight: 500 }}
                >
                  <Smartphone size={13} /> Mobile
                </button>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${previewMode === 'desktop'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  style={{ fontWeight: 500 }}
                >
                  <Monitor size={13} /> Desktop
                </button>
              </div>
            </div>

            {/* Mobile Preview */}
            {previewMode === 'mobile' ? (
              <div className="flex justify-center">
                <div
                  className={`w-64 rounded-[2.5rem] border-4 p-2 shadow-xl ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-800 bg-white'}`}
                  style={{ minHeight: 460 }}
                >
                  {/* Phone screen */}
                  <div className={`rounded-[2rem] overflow-hidden h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} style={{ minHeight: 450 }}>
                    {/* Status bar */}
                    <div className={`flex justify-between px-4 py-2 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                      <span className={`text-xs ${textSecondary}`}>9:41</span>
                      <div className="w-16 h-3 rounded-full bg-black mx-auto" />
                      <span className={`text-xs ${textSecondary}`}>●●●</span>
                    </div>

                    {/* Instagram-style post */}
                    <div className={darkMode ? 'bg-gray-900' : 'bg-white'}>
                      {/* Header */}
                      <div className="flex items-center px-3 py-2 gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-xs" style={{ fontWeight: 600 }}>A</span>
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs ${textPrimary}`} style={{ fontWeight: 600 }}>AdMaster</p>
                          <p className={`text-xs ${textSecondary}`} style={{ fontSize: '0.6rem' }}>Sponsored</p>
                        </div>
                        <span className={`text-lg leading-none ${textSecondary}`}>···</span>
                      </div>

                      {/* Image */}
                      <div className={`w-full h-36 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-100 to-purple-100'} flex items-center justify-center`}>
                        {uploadedImage ? (
                          <img src={uploadedImage} alt="Ad" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <Image size={28} className={textSecondary} />
                            <p className={`text-xs mt-1 ${textSecondary}`}>Your image here</p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="px-3 py-2">
                        <p className={`text-xs ${textPrimary} line-clamp-2`} style={{ fontWeight: 500 }}>
                          {headline || 'Your headline appears here'}
                        </p>
                        <p className={`text-xs mt-1 line-clamp-2 ${textSecondary}`} style={{ fontSize: '0.65rem' }}>
                          {primaryText || 'Your ad text will appear here...'}
                        </p>
                        <button className="mt-2 w-full py-1.5 bg-indigo-600 text-white text-xs rounded-lg" style={{ fontWeight: 600 }}>
                          {cta}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Preview */
              <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                {/* Browser chrome */}
                <div className={`flex items-center gap-2 px-3 py-2 border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex gap-1">
                    {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div className={`flex-1 mx-2 px-3 py-1 rounded-md text-xs ${darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                    instagram.com
                  </div>
                </div>

                {/* Ad content */}
                <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-xs" style={{ fontWeight: 600 }}>A</span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 600 }}>AdMaster</p>
                      <p className={`text-xs ${textSecondary}`}>Sponsored · {platform}</p>
                    </div>
                  </div>

                  <div className={`mt-3 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'} h-32 flex items-center justify-center`}>
                    {uploadedImage ? (
                      <img src={uploadedImage} alt="Ad" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Image size={28} className={textSecondary} />
                        <p className={`text-xs mt-1 ${textSecondary}`}>Upload an image to preview</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className={`text-sm ${textPrimary}`} style={{ fontWeight: 600 }}>{headline || 'Your headline'}</p>
                    <p className={`text-xs mt-1 line-clamp-2 ${textSecondary}`}>{primaryText || 'Your primary text...'}</p>
                    <button className="mt-3 px-4 py-1.5 border border-indigo-500 text-indigo-600 text-xs rounded-lg hover:bg-indigo-50" style={{ fontWeight: 600 }}>
                      {cta}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'} border ${darkMode ? 'border-gray-700' : 'border-indigo-100'}`}>
              <p className={`text-xs ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} style={{ fontWeight: 500 }}>
                💡 Preview updates live as you type. Switch between mobile and desktop views.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

