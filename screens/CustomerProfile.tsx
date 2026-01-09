
import React, { useState, useRef } from 'react';
import { Camera, User, Save, LogOut, CheckCircle, ShieldCheck, Phone, BadgeCheck, Upload } from 'lucide-react';
import { User as UserType } from '../types';

interface CustomerProfileProps {
  onLogout: () => void;
  showToast: (message: string, type?: any) => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ onLogout, showToast }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<Partial<UserType>>({
    name: 'John Doe',
    phone: '+234 812 445 0000',
    avatar: 'https://i.pravatar.cc/300?u=comx-user'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, avatar: reader.result as string }));
        showToast('Avatar updated locally', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API synchronization
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    showToast('Profile synchronized successfully', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black dark:text-white tracking-tighter">Client Identity</h1>
        <p className="text-slate-500 font-medium">Manage your professional credentials and marketplace presence.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[60px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-blue-500/5 overflow-hidden">
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 opacity-90 relative">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #ffffff22 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>

        <div className="px-8 md:px-16 pb-16 relative">
          {/* Avatar Interaction */}
          <div className="relative -mt-20 mb-12 flex justify-center">
            <div className="relative group">
              <div className="w-44 h-44 rounded-[56px] bg-white dark:bg-slate-900 border-[10px] border-white dark:border-slate-900 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                {user.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" alt="User Avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-300">
                    <User size={64} />
                  </div>
                )}
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-[2px]"
                >
                  <Camera size={28} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Update Portrait</span>
                </button>
              </div>
              
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3.5 rounded-2xl shadow-xl shadow-blue-500/40 border-4 border-white dark:border-slate-900">
                <BadgeCheck size={24} />
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-10">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-2">Display Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={user.name}
                    onChange={e => setUser({...user, name: e.target.value})}
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-[32px] py-5 pl-14 pr-6 outline-none transition-all dark:text-white font-black text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] ml-2">Verified Mobile (Read-only)</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    disabled
                    value={user.phone}
                    className="w-full bg-slate-100 dark:bg-slate-800/20 border-2 border-transparent rounded-[32px] py-5 pl-14 pr-6 text-slate-400 font-bold text-lg cursor-not-allowed"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <ShieldCheck size={18} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-slate-50 dark:border-slate-800">
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-6 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={22} /> Synchronize Profile
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={onLogout}
                className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-rose-500 px-10 py-6 rounded-[32px] font-black text-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all flex items-center justify-center gap-3"
              >
                <LogOut size={22} /> Terminate Session
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Info */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption Active</span>
        </div>
        <div className="hidden md:block w-1 h-1 rounded-full bg-slate-200"></div>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Multi-Factor Enabled</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
