
import React, { useState, useEffect } from 'react';
import { FileText, ChevronRight, Package, Truck, CheckCircle } from 'lucide-react';
import { Order } from '../types';
import { apiClient } from '../api/client';
import { formatCurrency, formatDate } from '../utils/format';

const CustomerOrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await apiClient.getOrders();
    setOrders(data);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">My Orders</h1>
      
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading your history...</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-slate-900 dark:text-white">{order.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{formatDate(order.date)}</p>
                </div>
                <p className="text-xl font-black text-blue-600">{formatCurrency(order.total, order.currency)}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex -space-x-3 overflow-hidden">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200">
                       <img className="h-full w-full object-cover rounded-full" src={`https://picsum.photos/seed/order${i}/50/50`} alt="" />
                    </div>
                  ))}
                  <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 text-[10px] font-bold text-slate-400">
                    +2
                  </div>
                </div>
                <button className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 hover:text-blue-600 transition-colors">
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrderHistory;
