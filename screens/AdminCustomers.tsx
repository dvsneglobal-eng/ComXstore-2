
import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, ExternalLink } from 'lucide-react';
import { apiClient } from '../api/client';
import { formatCurrency } from '../utils/format';
import { Currency } from '../types';

const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await apiClient.getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">Customer Directory</h1>
        <p className="text-slate-500 text-sm">View and manage your registered clients.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
           <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Total Orders</th>
                <th className="px-6 py-4">Last Order</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                        {c.name.substring(0, 2)}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{c.phone}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(c.totalSpent, Currency.NGN)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{c.lastOrder}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1">
                      View Profile <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
