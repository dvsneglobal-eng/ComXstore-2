
import React, { useState, useEffect } from 'react';
import { Store, Camera, Save, Globe, Phone, MapPin, DollarSign, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { StoreProfile, Currency } from '../types';
import { apiClient } from '../api/client';

const AdminStoreProfile: React.FC = () => {
  const [profile, setProfile] = useState<StoreProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await apiClient.getStoreProfile();
    setProfile(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API update
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    alert('Global Store Configuration Updated');
  };

  if (loading || !profile) {
    return <div className="p-20 text-center animate-pulse text-slate-400 font-black tracking-widest uppercase">Synchronizing Store Metadata...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Store Configuration</h1>
        <p className="text-slate-500 font-medium mt-2">Manage your marketplace identity and regional operational settings.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[60px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-blue-500/5 overflow-hidden">
        {/* Profile Header Background */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

        <div className="px-12 pb-12 relative">
          {/* Logo Upload */}
          <div className="relative -mt-20 mb-12">
            <div className="w-40 h-40 rounded-[48px] bg-white dark:bg-slate-800 border-8 border-white dark:border-slate-900 overflow-hidden shadow-2xl">
              <img src={profile.logo} className="w-full h-full object-cover" alt="Store Logo" />
              <button className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white flex-col gap-2">
                <Camera size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Update</span>
              </button>
            </div>
            <div className="absolute bottom-2 right-0 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg">
              <CheckCircle size={20} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Marketplace Identity</label>
                <div className="relative group">
                  <Store className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    required
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-3xl py-5 pl-14 pr-6 outline-none transition-all dark:text-white font-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Base Transaction Currency</label>
                <div className="relative group">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <select 
                    value={profile.currency}
                    onChange={e => setProfile({...profile, currency: e.target.value as Currency})}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-3xl py-5 pl-14 pr-6 outline-none transition-all dark:text-white font-black appearance-none"
                  >
                    {Object.values(Currency).map(c => <option key={c} value={c}>{c} Markets</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">WhatsApp Integration Line</label>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    required
                    value={profile.whatsapp}
                    onChange={e => setProfile({...profile, whatsapp: e.target.value})}
                    type="tel" 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-3xl py-5 pl-14 pr-6 outline-none transition-all dark:text-white font-black"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Regional HQ Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    required
                    value={profile.address}
                    onChange={e => setProfile({...profile, address: e.target.value})}
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-3xl py-5 pl-14 pr-6 outline-none transition-all dark:text-white font-black"
                  />
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
               <button 
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.01] transition-all disabled:opacity-50"
               >
                 {saving ? <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><Save size={24} /> Deploy Store Configuration</>}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminStoreProfile;
