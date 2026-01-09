
import React, { useState, useEffect } from 'react';
// Added Package to the imports from lucide-react
import { ShoppingBag, Filter, Calendar, MessageSquare, Download, CheckCircle, Clock, X, Phone, User, MapPin, Truck, ChevronRight, Package } from 'lucide-react';
import { Order, Currency } from '../types';
import { apiClient } from '../api/client';
import { formatCurrency, formatDate } from '../utils/format';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await apiClient.getOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleSendInvoice = async (order: Order) => {
    await apiClient.triggerWhatsAppAlert('+23400000000', `Hi ${order.customerName}, here is your digital invoice for order ${order.id}. Track your delivery in the ComX app.`);
    alert(`WhatsApp Invoice sent to ${order.customerName}`);
  };

  const updateStatus = async (status: Order['status']) => {
    if (!selectedOrder) return;
    setLoading(true);
    // Simulate API
    await new Promise(r => setTimeout(r, 600));
    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status } : o));
    setSelectedOrder(prev => prev ? { ...prev, status } : null);
    setLoading(false);
  };

  const filtered = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-500/10 text-emerald-500';
      case 'PENDING': return 'bg-amber-500/10 text-amber-500';
      case 'SHIPPED': return 'bg-blue-500/10 text-blue-500';
      case 'DELIVERED': return 'bg-indigo-500/10 text-indigo-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black dark:text-white tracking-tighter">Order Processing</h1>
          <p className="text-slate-500 font-medium">Monitoring real-time transactions across the MCP network.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 px-6 py-3.5 rounded-2xl text-sm font-black text-slate-600 dark:text-slate-300 hover:border-blue-500 transition-all">
            <Calendar size={18} />
            Period Select
          </button>
          <button className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl shadow-blue-500/10 hover:scale-105 transition-all">
            <Download size={18} />
            Ledger Export
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {['ALL', 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-8 py-3.5 rounded-full text-xs font-black transition-all border-2 whitespace-nowrap uppercase tracking-widest ${
              filter === s 
                ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-blue-500/30'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && orders.length === 0 ? (
          <div className="p-24 text-center text-slate-400 font-black uppercase tracking-widest bg-white dark:bg-slate-900 rounded-[40px]">Syncing Orders...</div>
        ) : filtered.map(order => (
          <div 
            key={order.id} 
            onClick={() => setSelectedOrder(order)}
            className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer relative"
          >
            <div className="flex items-center gap-6">
              <div className={`p-5 rounded-[24px] shadow-inner ${getStatusColor(order.status)}`}>
                <ShoppingBag size={28} strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-2xl text-slate-900 dark:text-white uppercase tracking-tighter">#{order.id}</span>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                   <p className="text-sm font-black text-slate-700 dark:text-slate-300">{order.customerName}</p>
                   <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{formatDate(order.date)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-12 border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-100 dark:border-slate-800">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Valuation</p>
                <p className="text-2xl font-black text-blue-600 tracking-tighter">{formatCurrency(order.total, order.currency)}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSendInvoice(order); }}
                  className="p-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg"
                >
                  <MessageSquare size={20} />
                </button>
                <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[60px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-10 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
              {/* Left Column: Order Stats */}
              <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-800/20 p-12 space-y-10 border-r border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-blue-500/20">
                    <ShoppingBag size={32} />
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-1">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Transaction Node</p>
                   <h2 className="text-4xl font-black dark:text-white tracking-tighter">#{selectedOrder.id}</h2>
                   <p className="text-emerald-500 font-bold text-sm">Synchronized with MCP</p>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Client Name</p>
                      <p className="text-sm font-black dark:text-white">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">WhatsApp Link</p>
                      <p className="text-sm font-black dark:text-white">+234 812 445 0000</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Delivery Vector</p>
                      <p className="text-sm font-black dark:text-white">Lagos Island Hub, Hub A</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 space-y-4">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Update Status Protocol</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'].map(st => (
                      <button 
                        key={st}
                        onClick={() => updateStatus(st as Order['status'])}
                        className={`py-3 rounded-xl text-[10px] font-black tracking-widest border-2 transition-all ${selectedOrder.status === st ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-transparent text-slate-500 hover:border-slate-200'}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Line Items */}
              <div className="lg:col-span-3 p-12 flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-6 pr-4">
                  <h3 className="text-xl font-black dark:text-white tracking-tight mb-8">Manifest Details</h3>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[32px] border border-slate-100 dark:border-slate-800/50">
                      <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-md text-blue-600">
                         <Package size={32} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black dark:text-white tracking-tight">{item.name}</p>
                        <p className="text-xs text-slate-500 font-bold mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black dark:text-white tracking-tighter">{formatCurrency(item.price * item.quantity, selectedOrder.currency)}</p>
                        <p className="text-[10px] text-slate-400 font-bold">Unit: {formatCurrency(item.price, selectedOrder.currency)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Gross Manifest Value</span>
                    <span className="text-3xl font-black text-blue-600 tracking-tighter">{formatCurrency(selectedOrder.total, selectedOrder.currency)}</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleSendInvoice(selectedOrder)}
                      className="flex-1 bg-slate-900 text-white py-5 rounded-[24px] font-black flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl"
                    >
                      <MessageSquare size={20} /> Deploy WhatsApp Invoice
                    </button>
                    <button className="bg-emerald-500 text-white p-5 rounded-[24px] hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
                      <Truck size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
