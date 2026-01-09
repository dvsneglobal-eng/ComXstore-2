
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Filter, Star, ChevronRight, Zap, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product, Category, Currency } from '../types';
import { apiClient } from '../api/client';
import { formatCurrency } from '../utils/format';

interface CustomerStorefrontProps {
  onAddToCart?: (name: string) => void;
  onViewProduct?: (id: string) => void;
}

const CategoryChip: React.FC<{ category: Category; active: boolean; onClick: () => void }> = ({ category, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-4 px-8 py-5 rounded-[28px] transition-all duration-500 border-2 whitespace-nowrap group
      ${active 
        ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/30 -translate-y-1' 
        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800'
      }
    `}
  >
    <div className={`text-2xl transition-transform group-hover:scale-125 duration-500 ${active ? 'scale-110' : ''}`}>
      {category.icon}
    </div>
    <div className="text-left">
      <span className="text-xs font-black tracking-tight uppercase block leading-none">{category.name}</span>
      <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 block opacity-60 ${active ? 'text-white' : 'text-slate-400'}`}>
        {category.count} items
      </span>
    </div>
  </button>
);

const ProductCard: React.FC<{ product: Product; onAddToCart: () => void; onClick: () => void }> = ({ product, onAddToCart, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden border border-slate-100 dark:border-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 premium-card cursor-pointer hover:scale-[1.02]"
  >
    <div className="relative h-72 overflow-hidden m-4 rounded-[40px]">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" />
      
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          className="w-full bg-white text-slate-900 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 hover:bg-blue-600 hover:text-white shadow-2xl"
        >
          <ShoppingCart size={20} strokeWidth={3} /> Quick Add
        </button>
      </div>

      <div className="absolute top-6 right-6">
        <button className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-[24px] text-slate-400 hover:text-rose-500 shadow-xl transition-all hover:scale-110 active:scale-95">
          <Heart size={20} strokeWidth={2.5} />
        </button>
      </div>
      
      {product.featured && (
        <div className="absolute top-6 left-6 flex items-center gap-2 bg-blue-600 text-white text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/30">
          <Award size={14} /> Certified
        </div>
      )}
    </div>

    <div className="px-10 pb-10 pt-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg">Performance</span>
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
           <Star size={12} className="text-orange-500" fill="currentColor" />
           <span className="text-xs font-black dark:text-white">4.9</span>
        </div>
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight group-hover:text-blue-600 transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 font-medium leading-relaxed">
        {product.description}
      </p>
      
      <div className="flex items-end justify-between mt-10">
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5 opacity-60">Listing Price</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            {formatCurrency(product.price, product.currency)}
          </p>
        </div>
        <div className="flex items-center justify-center w-14 h-14 bg-slate-900 dark:bg-slate-800 text-white rounded-[22px] group-hover:bg-blue-600 transition-all shadow-lg group-hover:rotate-45">
          <ArrowRight size={24} />
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
    <div className="space-y-16 animate-in fade-in duration-1000">
      {/* Immersive Hero Section */}
      <section className="relative h-[600px] rounded-[80px] overflow-hidden group shadow-3xl">
        <img 
          src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Store" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5s] brightness-[0.4]" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-center px-12 md:px-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-0.5 bg-blue-500"></div>
            <span className="text-blue-400 font-black uppercase tracking-[0.4em] text-xs">Excellence by ComX</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white max-w-4xl leading-[0.85] tracking-tighter mb-10">
            Precision Parts. <br/> <span className="text-blue-500">Unrivaled</span> Reach.
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-2xl mt-4 font-medium leading-relaxed opacity-80">
            Engineered for African terrains. Verified via n8n MCP systems. Sourced globally, delivered locally.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-12">
            <button className="bg-blue-600 text-white px-12 py-6 rounded-[32px] font-black text-lg shadow-3xl shadow-blue-500/40 hover:scale-110 hover:bg-blue-700 transition-all flex items-center gap-3">
              Catalog Discovery <ChevronRight size={24} />
            </button>
            <button className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-12 py-6 rounded-[32px] font-black text-lg hover:bg-white/20 transition-all">
              Market Reports
            </button>
          </div>
        </div>
      </section>

      {/* Modern Search & Categories */}
      <div className="space-y-10">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="w-full lg:flex-1 relative group max-w-2xl">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={28} />
            <input 
              type="text" 
              placeholder="Search components archive..." 
              className="w-full pl-20 pr-10 py-8 rounded-[40px] bg-white dark:bg-slate-900 border-none shadow-2xl shadow-blue-500/[0.05] outline-none transition-all dark:text-white text-xl font-bold focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
            />
          </div>
          <button className="flex items-center gap-3 bg-white dark:bg-slate-900 px-10 py-8 rounded-[40px] border border-slate-100 dark:border-slate-800 font-black text-slate-600 dark:text-slate-300 shadow-xl shadow-blue-500/[0.03] hover:border-blue-500 transition-all">
            <Filter size={24} /> Advanced Filter
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide -mx-8 px-8 items-center">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`flex flex-col items-center justify-center min-w-[140px] h-[140px] rounded-[48px] border-2 transition-all duration-500 ${activeCategory === 'all' ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-110' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-400'}`}
          >
            <span className="text-4xl mb-2 leading-none">📦</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Archive</span>
          </button>
          {categories.map(cat => (
            <CategoryChip key={cat.id} category={cat} active={activeCategory === cat.id} onClick={() => setActiveCategory(cat.id)} />
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <section className="pb-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Current Inventory</h2>
            <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Recently indexed parts from global suppliers</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black dark:text-white tracking-widest uppercase">Live Data</span>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-white dark:bg-slate-800/50 h-[550px] rounded-[48px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
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
      </section>
    </div>
  );
};

export default CustomerStorefront;
