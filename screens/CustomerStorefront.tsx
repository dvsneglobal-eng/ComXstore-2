
import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Search, 
  Filter, 
  Star, 
  ChevronRight, 
  Zap, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Flame,
  Clock
} from 'lucide-react';
import { Product, Category, Currency } from '../types';
import { apiClient } from '../api/client';
import { formatCurrency } from '../utils/format';

interface CustomerStorefrontProps {
  onAddToCart?: (name: string) => void;
  onViewProduct?: (id: string) => void;
}

const CategoryButton: React.FC<{ category: Category; active: boolean; onClick: () => void }> = ({ category, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center min-w-[120px] md:min-w-[160px] h-[140px] md:h-[180px] rounded-[40px] md:rounded-[56px] transition-all duration-700 border-2 group relative overflow-hidden
      ${active 
        ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/40 -translate-y-2' 
        : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-50 dark:border-slate-800/50 hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-slate-800'
      }
    `}
  >
    {active && (
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    )}
    <div className={`text-4xl md:text-5xl mb-4 transition-all duration-500 group-hover:scale-125 ${active ? 'scale-110 drop-shadow-lg' : 'grayscale group-hover:grayscale-0'}`}>
      {category.icon}
    </div>
    <div className="text-center px-2">
      <span className={`text-[10px] md:text-xs font-black tracking-tight uppercase block leading-none ${active ? 'text-white' : 'text-slate-900 dark:text-slate-300'}`}>
        {category.name}
      </span>
      <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-2 block opacity-60 ${active ? 'text-blue-100' : 'text-slate-400'}`}>
        {category.count} items
      </span>
    </div>
  </button>
);

const ProductCard: React.FC<{ product: Product; onAddToCart: () => void; onClick: () => void }> = ({ product, onAddToCart, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white dark:bg-slate-900 rounded-[56px] overflow-hidden border border-slate-100 dark:border-slate-800/50 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] transition-all duration-700 cursor-pointer flex flex-col h-full hover:-translate-y-2"
  >
    <div className="relative h-64 md:h-72 overflow-hidden m-4 md:m-5 rounded-[44px] bg-slate-50 dark:bg-slate-800/20">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" />
      
      {/* Quick Action Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
         <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          className="bg-white text-slate-900 p-5 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500 hover:bg-blue-600 hover:text-white"
        >
          <ShoppingCart size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="absolute top-5 right-5">
        <button className="p-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-2xl text-slate-400 hover:text-rose-500 shadow-xl transition-all hover:scale-110 active:scale-95">
          <Heart size={18} strokeWidth={2.5} />
        </button>
      </div>
      
      {product.featured && (
        <div className="absolute top-5 left-5 flex items-center gap-2 bg-blue-600 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/30">
          <Award size={12} /> Masterpiece
        </div>
      )}
    </div>

    <div className="px-8 pb-10 pt-2 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
           <Star size={12} className="text-orange-500" fill="currentColor" />
           <span className="text-xs font-black dark:text-white">4.9</span>
           <span className="text-[10px] text-slate-400 font-bold ml-1">(120+)</span>
        </div>
        {product.stock < 10 && (
          <span className="text-[9px] font-black uppercase text-rose-500 tracking-widest animate-pulse">Low Stock</span>
        )}
      </div>
      
      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight group-hover:text-blue-600 transition-colors mb-3">
        {product.name}
      </h3>
      
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed mb-6">
        {product.description}
      </p>
      
      <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800/50 flex items-end justify-between">
        <div>
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 opacity-60">Price Guide</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
            {formatCurrency(product.price, product.currency)}
          </p>
        </div>
        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:shadow-blue-500/40">
           <ChevronRight size={20} />
        </div>
      </div>
    </div>
  </div>
);

const CustomerStorefront: React.FC<CustomerStorefrontProps> = ({ onAddToCart, onViewProduct }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getProducts(activeCategory)
      ]);
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    };
    loadData();
  }, [activeCategory]);

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-1000">
      {/* Sophisticated Hero Section */}
      <section className="relative h-[500px] md:h-[650px] rounded-[60px] md:rounded-[100px] overflow-hidden group">
        <div className="absolute inset-0 bg-slate-950">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2400" 
            alt="Premium Auto Header" 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[10s]" 
          />
        </div>
        
        {/* Glowing Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full -mr-40" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-center px-8 md:px-24">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">ComX Strategic Reserve</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter">
              DRIVE THE <br/> <span className="text-blue-500">EXCEPTION.</span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-2xl max-w-xl font-medium leading-relaxed opacity-80">
              Verified OEM components indexed daily from top-tier global suppliers, localized for the African market.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-6">
              <button className="bg-white text-slate-900 px-10 md:px-14 py-5 md:py-6 rounded-full font-black text-base md:text-lg shadow-2xl hover:bg-blue-600 hover:text-white hover:scale-110 transition-all flex items-center gap-3 group/btn">
                Discover Catalog <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
              <button className="bg-white/5 backdrop-blur-xl border border-white/10 text-white px-10 md:px-14 py-5 md:py-6 rounded-full font-black text-base md:text-lg hover:bg-white/10 transition-all">
                Partner Logins
              </button>
            </div>
          </div>
        </div>

        {/* Floating Stats Badge */}
        <div className="absolute bottom-12 right-12 hidden xl:flex items-center gap-8 bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[48px]">
          <div className="text-center">
             <p className="text-3xl font-black text-white tracking-tighter">24k+</p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Parts Catalog</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
             <p className="text-3xl font-black text-blue-500 tracking-tighter">1.2ms</p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">MCP Latency</p>
          </div>
        </div>
      </section>

      {/* Dynamic Navigation & Search */}
      <div className="space-y-12">
        <div className="flex flex-col lg:flex-row gap-10 items-end justify-between">
          <div className="space-y-4 max-w-2xl w-full">
            <h2 className="text-3xl md:text-4xl font-black dark:text-white tracking-tighter flex items-center gap-4">
               Navigation Hub <TrendingUp size={28} className="text-blue-600" />
            </h2>
            <div className="relative group w-full">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Query our component archives..." 
                className="w-full pl-20 pr-10 py-7 md:py-8 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-blue-500/[0.03] outline-none transition-all dark:text-white text-lg font-bold placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
             <button className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white dark:bg-slate-900 px-10 py-7 rounded-[32px] border border-slate-100 dark:border-slate-800 font-black text-slate-600 dark:text-slate-300 shadow-lg hover:border-blue-500 transition-all">
               <Filter size={20} /> Adjust View
             </button>
          </div>
        </div>

        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-10 scrollbar-hide -mx-4 px-4 items-center">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`flex flex-col items-center justify-center min-w-[120px] md:min-w-[160px] h-[140px] md:h-[180px] rounded-[40px] md:rounded-[56px] border-2 transition-all duration-700 ${activeCategory === 'all' ? 'bg-slate-900 dark:bg-blue-600 border-slate-900 dark:border-blue-600 text-white shadow-2xl scale-110 -translate-y-2' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-400'}`}
          >
            <span className="text-4xl md:text-5xl mb-4 leading-none">🏢</span>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-tight">Main Hub</span>
          </button>
          {categories.map(cat => (
            <CategoryButton key={cat.id} category={cat} active={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)} />
          ))}
        </div>
      </div>

      {/* Curated Grid Section */}
      <section className="pb-32 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">
               <Clock size={14} /> Synchronized 2m ago
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Current Archives</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">High-performance parts verified across regional nodes</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Network Active
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-white dark:bg-slate-900/40 h-[500px] rounded-[56px] animate-pulse border border-slate-50 dark:border-slate-800" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
            {products.map(prod => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
                onClick={() => onViewProduct && onViewProduct(prod.id)}
                onAddToCart={() => { if(onAddToCart) onAddToCart(prod.name); }} 
              />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="py-32 text-center space-y-6 bg-white dark:bg-slate-900 rounded-[60px] border-2 border-dashed border-slate-100 dark:border-slate-800">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-4xl">🔎</div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black dark:text-white tracking-tighter">No components located</h3>
              <p className="text-slate-500 font-medium">Your current filter configuration yielded zero results in the active node.</p>
            </div>
            <button onClick={() => setActiveCategory('all')} className="text-blue-600 font-black uppercase text-xs tracking-[0.2em] hover:underline">Reset Node Filter</button>
          </div>
        )}
      </section>

      {/* Bottom Experience Bar (Sticky/Floating concept) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-3 bg-slate-900/90 dark:bg-blue-600/90 backdrop-blur-3xl px-8 py-5 rounded-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/10 animate-in slide-in-from-bottom-10 duration-700">
         <div className="flex items-center gap-3 pr-6 border-r border-white/10">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
               <ShieldCheck size={20} />
            </div>
            <div>
               <p className="text-white text-xs font-black tracking-tight leading-none">ComX Guard</p>
               <p className="text-[9px] text-white/60 font-bold uppercase tracking-widest mt-1">Active Protection</p>
            </div>
         </div>
         <div className="flex items-center gap-8 pl-4">
            <div className="flex items-center gap-2">
               <Flame size={14} className="text-orange-400" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Trending Hub</span>
            </div>
            <div className="flex items-center gap-2">
               <Zap size={14} className="text-yellow-400" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">Flash Dispatch</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CustomerStorefront;
