import React, { useState, useEffect, useMemo } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Star, X, Image as ImageIcon, CheckCircle, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Product, Currency, Category } from '../types';
import { apiClient } from '../api/client';
import { formatCurrency } from '../utils/format';

type SortKey = 'name' | 'category' | 'price' | 'stock';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'name', direction: 'asc' });

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '1',
    stock: 0,
    description: '',
    image: '',
    featured: false,
    currency: Currency.NGN
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([
      apiClient.getProducts(),
      apiClient.getCategories()
    ]);
    setProducts(p);
    setCategories(c);
    setLoading(false);
  };

  const handleToggleFeatured = async (id: string) => {
    await apiClient.toggleFeatured(id);
    loadData();
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: 0,
        category: '1',
        stock: 0,
        description: '',
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400',
        featured: false,
        currency: Currency.NGN
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    // Logic to update local mock would go here in real app
    // For now we just refresh and close
    await loadData();
    setIsModalOpen(false);
    setLoading(false);
    alert(editingProduct ? 'Product updated successfully' : 'Product added to inventory');
  };

  const processedProducts = useMemo(() => {
    let result = [...products].filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'category') {
          aValue = categories.find(c => c.id === a.category)?.name || '';
          bValue = categories.find(c => c.id === b.category)?.name || '';
        } else {
          aValue = a[sortConfig.key as keyof Product];
          bValue = b[sortConfig.key as keyof Product];
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, search, sortConfig, categories]);

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={12} className="text-blue-600" /> : <ChevronDown size={12} className="text-blue-600" />;
  };

  const HeaderButton = ({ label, columnKey, className }: { label: string, columnKey: SortKey, className: string }) => (
    <th className={`${className} group cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors`} onClick={() => handleSort(columnKey)}>
      <div className="flex items-center gap-2">
        {label}
        <SortIcon columnKey={columnKey} />
      </div>
    </th>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black dark:text-white tracking-tighter">Product Inventory</h1>
          <p className="text-slate-500 font-medium">Manage your auto parts stock and pricing across markets.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <Plus size={22} strokeWidth={3} />
          Inventory Intake
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Filter by part name or SKU..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-black tracking-widest sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <HeaderButton label="Component" columnKey="name" className="px-8 py-5" />
                <HeaderButton label="Category" columnKey="category" className="px-6 py-5" />
                <HeaderButton label="Unit Price" columnKey="price" className="px-6 py-5" />
                <HeaderButton label="Stock Level" columnKey="stock" className="px-6 py-5" />
                <th className="px-6 py-5">Featured</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-bold">Synchronizing Archive...</td></tr>
              ) : processedProducts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-slate-400 font-bold">No components match your search.</td></tr>
              ) : processedProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-700">
                        <img src={p.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <span className="font-black text-slate-900 dark:text-white block tracking-tight">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">SKU: COM-X-{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-tighter">
                      {categories.find(c => c.id === p.category)?.name || 'Misc'}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-slate-900 dark:text-white">
                    {formatCurrency(p.price, p.currency)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                      <span className="text-sm font-black dark:text-slate-300 tracking-tight">{p.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => handleToggleFeatured(p.id)}
                      className={`p-3 rounded-xl transition-all ${p.featured ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10 shadow-sm' : 'text-slate-300 hover:text-slate-400'}`}
                    >
                      <Star size={20} fill={p.featured ? "currentColor" : "none"} strokeWidth={3} />
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(p)}
                        className="p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button className="p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-black dark:text-white tracking-tighter">
                {editingProduct ? 'Update Component Registry' : 'New Component Intake'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Part Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    type="text" 
                    placeholder="e.g. V6 Exhaust Manifold"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 px-5 outline-none transition-all dark:text-white font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 px-5 outline-none transition-all dark:text-white font-bold"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price (Base Market)</label>
                  <input 
                    required
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    type="number" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 px-5 outline-none transition-all dark:text-white font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Initial Stock</label>
                  <input 
                    required
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                    type="number" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 px-5 outline-none transition-all dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Technical Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  placeholder="Details regarding compatibility, material, and origin..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-3xl py-4 px-5 outline-none transition-all dark:text-white font-medium text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Image Asset URL</label>
                <div className="flex gap-4">
                  <input 
                    required
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    type="url" 
                    placeholder="https://..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl py-4 px-5 outline-none transition-all dark:text-white font-bold"
                  />
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                    {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-300" />}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={formData.featured}
                  onChange={e => setFormData({...formData, featured: e.target.checked})}
                  className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <label htmlFor="featured" className="text-sm font-black dark:text-white tracking-tight">Mark as Premium Featured Asset</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 py-5 rounded-[24px] font-black hover:bg-slate-50 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><CheckCircle size={20} /> Synchronize Metadata</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;