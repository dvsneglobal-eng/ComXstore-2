
import React, { useState } from 'react';
// Added X to the imports from lucide-react
import { Phone, MessageCircle, ArrowRight, ShieldCheck, Zap, Globe, Lock, X } from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
  onCancel?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOtp = (role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(role);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] flex flex-col lg:flex-row overflow-hidden relative">
      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-8 right-8 z-50 p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <X size={24} />
        </button>
      )}

      {/* Immersive Left Brand Section */}
      <div className="hidden lg:flex flex-1 bg-slate-900 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110" 
            alt="Dashboard Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-xl">
          <div className="w-20 h-20 bg-blue-600 rounded-[32px] flex items-center justify-center text-white text-4xl font-black mb-12 shadow-2xl shadow-blue-500/40">
            C
          </div>
          <h2 className="text-6xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            The Backbone of <span className="text-blue-500">African</span> Logistics.
          </h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md">
            Enter the professional ComXStore protocol for automotive parts sourcing, inventory tracking, and sales.
          </p>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 text-white">
            <div className="border-l-2 border-blue-600 pl-6">
              <p className="text-3xl font-black">4 Markets</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Regional</p>
            </div>
            <div className="border-l-2 border-blue-600 pl-6">
              <p className="text-3xl font-black">Instant</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">WhatsApp OTP</p>
            </div>
            <div className="border-l-2 border-blue-600 pl-6">
              <p className="text-3xl font-black">Secure</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">MCP Systems</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Login Flow Area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-[#020617]">
        <div className="w-full max-w-lg space-y-12 animate-slide-up">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {step === 'phone' ? 'Identity Verification' : 'Verify Key'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium">
              Access the ComXStore network with your WhatsApp number.
            </p>
          </div>

          <div className="space-y-8">
            {step === 'phone' ? (
              <div className="space-y-6">
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] py-6 pl-16 pr-8 text-xl font-bold focus:border-blue-500 outline-none transition-all dark:text-white shadow-xl shadow-blue-500/[0.02]"
                  />
                </div>
                <button 
                  onClick={handleSendOtp}
                  disabled={loading || !phone}
                  className="w-full bg-blue-600 text-white font-black py-6 rounded-[32px] flex items-center justify-center gap-3 hover:scale-[1.02] disabled:opacity-50 transition-all shadow-2xl shadow-blue-600/30"
                >
                  {loading ? <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : "Request Verification"}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <input key={i} type="text" maxLength={1} className="w-full h-24 text-center text-4xl font-black bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] focus:border-blue-500 outline-none dark:text-white transition-all shadow-lg" />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => handleVerifyOtp(UserRole.CUSTOMER)} className="bg-slate-900 dark:bg-blue-600 text-white font-black py-6 rounded-[32px] hover:scale-105 transition-all shadow-xl">Customer Access</button>
                  <button onClick={() => handleVerifyOtp(UserRole.ADMIN)} className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black py-6 rounded-[32px] hover:scale-105 transition-all">Admin Protocol</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
