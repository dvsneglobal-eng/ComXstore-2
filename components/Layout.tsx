
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  PieChart, 
  Bell, 
  Menu, 
  X,
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
  CreditCard,
  FileText,
  Search as SearchIcon,
  LogIn,
  Layers,
  Star,
  Settings,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole | 'GUEST';
  onLogout: () => void;
  onLoginRequest?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onLogout, onLoginRequest, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'store-profile', label: 'Store Profile', icon: Store },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'featured-products', label: 'Featured', icon: Star },
    { id: 'orders', label: 'Orders', icon: CreditCard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const customerMenu = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'catalog', label: 'Catalog', icon: Package },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'my-orders', label: 'Orders', icon: FileText },
    { id: 'my-profile', label: 'Profile', icon: UserIcon },
  ];

  const menu = role === UserRole.ADMIN ? adminMenu : customerMenu;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex transition-colors duration-500 overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Professional Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#030816] border-r border-slate-100 dark:border-slate-800/50 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">C</div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">ComXStore</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
            <p className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Navigation Menu</p>
            {menu.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-4 rounded-[20px] transition-all group relative
                  ${activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600'
                  }
                `}
              >
                <item.icon size={20} className={`${activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                {activeTab === item.id && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            {role !== 'GUEST' ? (
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-[20px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-bold text-sm"
              >
                <LogOut size={20} />
                <span>Terminate Session</span>
              </button>
            ) : (
              <button 
                onClick={onLoginRequest}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-[20px] bg-slate-900 text-white dark:bg-blue-600 font-black transition-all shadow-xl shadow-blue-500/10"
              >
                <LogIn size={20} />
                <span>Protocol Login</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Modern Header */}
        <header className="h-24 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <SearchIcon size={16} className="text-slate-400" />
              <input type="text" placeholder="Global system search..." className="bg-transparent border-none outline-none text-xs font-bold w-48 dark:text-white" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-blue-600 transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 pr-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <UserIcon size={20} />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black dark:text-white tracking-tighter uppercase">{role === 'GUEST' ? 'Unknown Entity' : role}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Status</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-[#020617]/20 scrollbar-hide">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
