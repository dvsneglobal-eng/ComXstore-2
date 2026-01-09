
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign,
  ArrowUpRight,
  MoreHorizontal,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 4200, orders: 240 },
  { name: 'Feb', revenue: 3800, orders: 198 },
  { name: 'Mar', revenue: 5100, orders: 120 },
  { name: 'Apr', revenue: 4780, orders: 210 },
  { name: 'May', revenue: 5890, orders: 150 },
  { name: 'Jun', revenue: 6390, orders: 170 },
  { name: 'Jul', revenue: 7490, orders: 250 },
];

const topProducts = [
  { name: 'V6 Engine Head', value: 850, trend: '+12%' },
  { name: 'Brembo Rotors', value: 720, trend: '+8%' },
  { name: 'LED Conversion', value: 590, trend: '+15%' },
  { name: 'Shock Absorbers', value: 410, trend: '-2%' },
  { name: 'Body Trim Kit', value: 350, trend: '+4%' },
];

const StatCard = ({ title, value, change, icon: Icon, color, isNegative }: any) => (
  <div className="bg-white dark:bg-slate-900 p-7 rounded-[32px] border border-slate-100 dark:border-slate-800/50 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
      <Icon size={80} />
    </div>
    <div className="flex items-start justify-between relative z-10">
      <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-blue-500/10`}>
        <Icon size={24} className="text-white" />
      </div>
      <button className="text-slate-300 hover:text-slate-600 transition-colors">
        <MoreHorizontal size={20} />
      </button>
    </div>
    <div className="mt-6 relative z-10">
      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black mt-1 dark:text-white tracking-tighter">{value}</h3>
      <div className={`flex items-center gap-1.5 mt-3 text-xs font-black ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
        <div className={`flex items-center justify-center w-5 h-5 rounded-full ${isNegative ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
          {isNegative ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
        </div>
        {change}% <span className="text-slate-400 font-semibold lowercase">vs last month</span>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Business Intelligence</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Monitoring AfriAuto MCP's performance across 4 markets.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1,2,3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 shadow-lg">
                <img src={`https://i.pravatar.cc/100?u=a${i}`} className="rounded-full" alt="" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
              +12
            </div>
          </div>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] transition-all">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="₦12.8M" change={18.5} icon={DollarSign} color="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard title="Active Sellers" value="2,840" change={4.2} icon={Users} color="bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <StatCard title="Net Orders" value="1,128" change={2.1} icon={ArrowUpRight} color="bg-gradient-to-br from-violet-500 to-violet-700" isNegative />
        <StatCard title="Storage Load" value="74%" change={12} icon={Package} color="bg-gradient-to-br from-emerald-500 to-emerald-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart - 2 cols wide */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black dark:text-white tracking-tight">Revenue Dynamics</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Growth Analysis: Q3 2024</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-bold dark:text-white outline-none">
              <option>Last 7 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: '700', fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: '700', fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#chartGradient)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products Sidebar */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800/50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black dark:text-white tracking-tight">Leaderboard</h3>
            <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {topProducts.map((p, idx) => (
              <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-lg font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  0{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{p.name}</p>
                  <p className="text-xs text-slate-500 font-medium">Vol: {p.value} units</p>
                </div>
                <div className={`text-xs font-black ${p.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {p.trend}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-slate-900 rounded-[32px] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Pro Tip</p>
            <p className="text-sm font-bold leading-relaxed">Optimization suggested for Engine categories in NGN market.</p>
            <button className="mt-4 flex items-center gap-2 text-xs font-black text-white group-hover:gap-3 transition-all">
              Apply Strategy <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
