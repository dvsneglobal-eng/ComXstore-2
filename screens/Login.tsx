
import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock, 
  X, 
  Fingerprint, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Activity
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
  onCancel?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onCancel }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) return;
    setLoading(true);
    // Simulate API network latency
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setCountdown(60);
    }, 1800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (role: UserRole) => {
    setLoading(true);
    // Simulate protocol verification
    setTimeout(() => {
      setLoading(false);
      onLogin(role);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-0 md:p-6 overflow-hidden relative font-['Plus_Jakarta_Sans']">
      
      {/* Advanced Animated Background Components */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/10 dark:bg-indigo-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Abstract Mesh Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {onCancel && (
        <button 
          onClick={onCancel}
          className="absolute top-8 right-8 z-50 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-xl hover:scale-110 active:scale-95 border border-slate-100 dark:border-slate-800"
        >
          <X size={24} />
        </button>
      )}

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1200px] h-full md:h-[800px] bg-white dark:bg-slate-900 md:rounded-[60px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Left: Brand Narrative (Desktop) */}
        <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden flex-col justify-between p-16">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-20 scale-105" 
              alt="Brand Heritage" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-500/40">C</div>
              <span className="text-2xl font-black text-white tracking-tighter">ComXStore</span>
            </div>
            
            <h2 className="text-7xl font-black text-white leading-[0.85] tracking-tighter mb-8">
              Engineered <br/> for the <br/> <span className="text-blue-500">Continent.</span>
            </h2>
            <p className="text-slate-400 text-xl max-w-sm font-medium leading-relaxed">
              Nigeria • Ghana • Kenya • South Africa
            </p>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center text-blue-500 border border-white/10">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-white font-black tracking-tight">Rapid Distribution</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Sourcing, Local Speed</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center text-emerald-500 border border-white/10">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-white font-black tracking-tight">Encrypted MCP Nodes</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">End-to-End Secure Transactions</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="relative z-10 pt-12 border-t border-white/10">
             <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800">
                        <img src={`https://i.pravatar.cc/100?u=u${i}`} className="rounded-full" alt="" />
                     </div>
                   ))}
                </div>
                <p className="text-slate-400 text-xs font-bold">Join <span className="text-white">50k+</span> professionals across Africa</p>
             </div>
          </div>
        </div>

        {/* Right: Interactive Authentication Form */}
        <div className="flex-1 flex flex-col p-8 md:p-20 justify-center">
          <div className="max-w-md mx-auto w-full space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-600">
                <Activity size={20} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">System Protocol 09.24</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                {step === 'phone' ? 'Network Entry' : 'Verify Key'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                {step === 'phone' 
                  ? 'Initiate your secure session via WhatsApp OTP.' 
                  : `Enter the 4-digit code dispatched to ${phone}`}
              </p>
            </div>

            <div className="space-y-8">
              {step === 'phone' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">WhatsApp Mobile Line</label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                         <Phone size={22} />
                         <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-700" />
                      </div>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0812 445 0000"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500 rounded-[32px] py-7 pl-20 pr-8 text-2xl font-black outline-none transition-all dark:text-white shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleSendOtp}
                    disabled={loading || phone.length < 10}
                    className="w-full bg-blue-600 text-white font-black py-7 rounded-[32px] flex items-center justify-center gap-4 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-2xl shadow-blue-600/30"
                  >
                    {loading ? (
                      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Request Secure Access <ArrowRight size={22} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800/50">
                     <Lock className="text-blue-600 shrink-0" size={20} />
                     <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 leading-relaxed uppercase tracking-widest">
                       Your data is protected by ComX end-to-end encryption protocols.
                     </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
                  <div className="flex justify-between gap-4">
                    {otp.map((digit, i) => (
                      <input 
                        key={i} 
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text" 
                        maxLength={1} 
                        value={digit}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-full h-24 text-center text-4xl font-black bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-[32px] outline-none dark:text-white transition-all shadow-inner focus:shadow-xl" 
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <p className="text-center text-sm font-bold text-slate-400">
                      {countdown > 0 ? (
                        <span className="flex items-center justify-center gap-2">
                           Resend available in <span className="text-blue-600 font-black">{countdown}s</span>
                        </span>
                      ) : (
                        <button onClick={() => setCountdown(60)} className="text-blue-600 hover:underline">Resend Verification Code</button>
                      )}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleVerifyOtp(UserRole.CUSTOMER)} 
                        className="group bg-slate-900 dark:bg-blue-600 text-white font-black py-7 rounded-[32px] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-2"
                      >
                        <Zap size={20} /> Customer Access
                      </button>
                      <button 
                        onClick={() => handleVerifyOtp(UserRole.ADMIN)} 
                        className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black py-7 rounded-[32px] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Fingerprint size={20} /> Admin Protocol
                      </button>
                    </div>
                  </div>
                  
                  <button onClick={() => setStep('phone')} className="w-full text-center text-slate-400 text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors">
                    Back to Entry Protocol
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Info */}
      <div className="absolute bottom-10 left-0 right-0 z-20 hidden md:flex items-center justify-center gap-8 text-slate-400/50">
         <div className="flex items-center gap-2">
            <Globe size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">AfriNet Global Backbone</span>
         </div>
         <div className="w-1 h-1 rounded-full bg-slate-400/20" />
         <div className="flex items-center gap-2">
            <Lock size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">TLS 1.3 Certified</span>
         </div>
         <div className="w-1 h-1 rounded-full bg-slate-400/20" />
         <div className="flex items-center gap-2">
            <Activity size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Lat: 1.2ms</span>
         </div>
      </div>
    </div>
  );
};

export default Login;
