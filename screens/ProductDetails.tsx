
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, ChevronLeft, Star, ShieldCheck, Zap, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { apiClient } from '../api/client';
import { formatCurrency } from '../utils/format';

interface ProductDetailsProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (name: string) => void;
  onViewProduct: (id: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onBack, onAddToCart, onViewProduct }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      const data = await apiClient.getProductById(productId);
      if (data) {
        setProduct(data);
        // Fetch related products in the same category
        const related = await apiClient.getProducts(data.category);
        setRelatedProducts(related.filter(p => p.id !== productId));
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-10 animate-pulse space-y-10">
        <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="h-[500px] bg-slate-200 dark:bg-slate-800 rounded-[60px]" />
          <div className="space-y-6">
            <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            <div className="h-16 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <h2 className="text-3xl font-black dark:text-white">Component not found.</h2>
        <button onClick={onBack} className="mt-6 text-blue-600 font-bold">Return to Catalog</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-24 animate-slide-up pb-20">
      {/* Product Main Section */}
      <div className="space-y-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all group"
        >
          <div className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ChevronLeft size={20} />
          </div>
          Return to Discovery
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Media Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[60px] overflow-hidden border border-slate-100 dark:border-slate-800 group shadow-2xl shadow-blue-500/5">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-8 right-8">
                <button className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[24px] text-slate-400 hover:text-rose-500 shadow-xl transition-all hover:scale-110">
                  <Heart size={24} strokeWidth={2.5} />
                </button>
              </div>
              {product.featured && (
                <div className="absolute top-8 left-8 bg-blue-600 text-white text-xs font-black px-6 py-3 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                  Premium Performance
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square rounded-3xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-transparent hover:border-blue-500 cursor-pointer transition-all">
                    <img src={product.image} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" alt="" />
                 </div>
               ))}
            </div>
          </div>

          {/* Purchase Interface */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
               <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                 <ShieldCheck size={14} /> Certified OEM
               </div>
               <div className="flex items-center gap-1 text-orange-500">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400">(42 Reviews)</span>
               </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">
              {product.name}
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-8">
              Network ID: COM-X-{product.id.toUpperCase()}
            </p>

            <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 mb-8">
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
                  {product.description}
               </p>
               <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                     <Zap size={16} className="text-orange-500" /> High Durability
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                     <ShieldCheck size={16} className="text-emerald-500" /> 2yr Warranty
                  </div>
               </div>
            </div>

            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Price Point</p>
                <p className="text-4xl font-black text-blue-600 tracking-tighter">
                  {formatCurrency(product.price, product.currency)}
                </p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Availability</p>
                 <p className={`text-lg font-black tracking-tighter ${product.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
                 </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-1 gap-4 shadow-sm">
                 <button 
                  onClick={() => {
                    const newQty = Math.max(1, quantity - 1);
                    setQuantity(newQty);
                  }}
                  className="w-12 h-12 flex items-center justify-center font-black dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
                 >
                   -
                 </button>
                 <span className="w-12 text-center text-xl font-black dark:text-white">{quantity}</span>
                 <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center font-black dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
                 >
                   +
                 </button>
              </div>
              <button 
                onClick={() => onAddToCart(product.name)}
                className="flex-1 bg-blue-600 text-white py-5 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <ShoppingCart size={22} strokeWidth={3} />
                Add to Basket
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
               <div className="text-center space-y-2">
                  <Truck size={20} className="mx-auto text-slate-400" />
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-tight">Fast<br/>Logistics</p>
               </div>
               <div className="text-center space-y-2">
                  <ShieldCheck size={20} className="mx-auto text-slate-400" />
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-tight">Secure<br/>Payment</p>
               </div>
               <div className="text-center space-y-2">
                  <RotateCcw size={20} className="mx-auto text-slate-400" />
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-tight">14 Day<br/>Returns</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black dark:text-white tracking-tighter">System Compatibilities</h2>
              <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest">Other parts in this category</p>
            </div>
            <button 
              onClick={onBack}
              className="hidden md:flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
            >
              Explore Category <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide -mx-2 px-2">
            {relatedProducts.map((p) => (
              <div 
                key={p.id}
                onClick={() => onViewProduct(p.id)}
                className="min-w-[300px] bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                  <div className="absolute top-4 right-4">
                    <button className="p-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl text-slate-400 hover:text-rose-500 shadow-sm transition-all">
                      <Heart size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Original Equipment</span>
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-orange-500" fill="currentColor" />
                      <span className="text-[10px] font-bold dark:text-white">4.8</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-blue-600 transition-colors truncate">
                    {p.name}
                  </h3>
                  <div className="flex items-end justify-between mt-6">
                    <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                      {formatCurrency(p.price, p.currency)}
                    </p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAddToCart(p.name); }}
                      className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
