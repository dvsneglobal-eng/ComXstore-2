
import React, { useState, useEffect } from 'react';
import { Layers, Plus, Search, Edit2, Trash2, X, CheckCircle } from 'lucide-react';
import { Category } from '../types';
import { apiClient } from '../api/client';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', icon: '⚙️' });

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = async () => {
    const data = await apiClient.getCategories();
    setCategories(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setIsModalOpen(false);
    loadCats();
    alert('Category Vector Established');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Category Management</h1>
          <p className="text-slate-500 font-medium mt-2">Classify and organize the parts catalog for efficient retrieval.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-10 py-5 rounded-[28px] font-black shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus size={24} strokeWidth={3} />
          Append Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="bg-white dark:bg-slate-800/50 h-48 rounded-[48px] animate-pulse" />)
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="bg-white dark:bg-slate-900 p-8 rounded-[48px] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all">
               <div className="flex items-center gap-6">
                 <div className="text-5xl group-hover:scale-110 transition-transform duration-500">
                   {cat.icon}
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{cat.name}</h3>
                   <p className="text-blue-600 font-black text-xs uppercase tracking-widest mt-1">{cat.count} Registered Units</p>
                 </div>
               </div>
               <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-2xl transition-all"><Edit2 size={18} /></button>
                 <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 rounded-2xl transition-all"><Trash2 size={18} /></button>
               </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[60px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-2xl font-black dark:text-white tracking-tighter">Append Category Entity</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category Label</label>
                <input 
                  required
                  value={newCat.name}
                  onChange={e => setNewCat({...newCat, name: e.target.value})}
                  type="text" 
                  placeholder="e.g. Braking Systems"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-3xl py-5 px-6 outline-none transition-all dark:text-white font-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Representation Icon (Emoji)</label>
                <input 
                  required
                  value={newCat.icon}
                  onChange={e => setNewCat({...newCat, icon: e.target.value})}
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-3xl py-5 px-6 outline-none transition-all dark:text-white font-black text-3xl text-center"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-[1.01] transition-all"
              >
                <CheckCircle size={24} /> Register Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
