
import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, CreditCard, ShieldCheck, X } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatCurrency } from '../utils/format';
import { apiClient } from '../api/client';
import { ToastType } from '../components/Toast';

interface CustomerCartProps {
  onCheckoutRequest?: () => void;
  showToast?: (message: string, type: ToastType) => void;
}

const CustomerCart: React.FC<CustomerCartProps> = ({ onCheckoutRequest, showToast }) => {
  const [items, setItems] = useState<any[]>([
    { productId: 'p1', name: 'V6 Cylinder Head', quantity: 1, price: 150000, image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=200' },
    { productId: 'p2', name: 'Brembo Pads', quantity: 2, price: 45000, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=200' },
  ]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const delivery = 5000;
  const total = subtotal + delivery;

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.productId === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (newQty !== item.quantity && showToast) {
          showToast(`Quantity updated for ${item.name}`, 'info');
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    const itemToRemove = items.find(i => i.productId === id);
    setItems(prev => prev.filter(i => i.productId !== id));
    if (itemToRemove && showToast) {
      showToast(`${itemToRemove.name} removed from basket`, 'info');
    }
  };

  const handleCheckout = async () => {
    if (onCheckoutRequest) {
      onCheckoutRequest();
    }
    
    // In a real app, we check if logged in. If yes, proceed.
    setCheckingOut(true);
    const res = await apiClient.createOrder({
      customerId: 'c1',
      customerName: 'ComX User',
      items: items.map(i => ({ productId: i.productId, name: i.name, quantity: i.quantity, price: i.price })),
      total,
      currency: Currency.NGN
    });
    
    if (res.success) {
      setTimeout(() => {
        setCheckingOut(false);
        setSuccess(true);
        setItems([]);
        if (showToast) showToast('Order successfully established', 'success');
      }, 1000);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 animate-in zoom-in duration-500 max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-[60px] p-12 shadow-2xl">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <ShieldCheck size={48} strokeWidth={3} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Secure Order!</h1>
        <p className="text-slate-500 font-medium">
          ComXStore has synchronized your order with the MCP backend. Your WhatsApp invoice is on its way.
        </p>
        <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-500/40">
          Finish Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Purchase Basket</h1>
        <p className="text-slate-500 font-medium mt-2">Verified components ready for dispatch.</p>
      </div>

      {items.length === 0 ? (
        <div className="p-24 text-center bg-white dark:bg-slate-900 rounded-[60px] border border-slate-100 dark:border-slate-800 shadow-xl">
          <ShoppingBag className="mx-auto text-slate-200 mb-6" size={80} />
          <p className="text-xl font-bold text-slate-400 tracking-tight">Basket is empty.</p>
          <button onClick={() => window.location.reload()} className="mt-8 text-blue-600 font-black uppercase text-xs tracking-widest hover:underline">Start Shopping</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {items.map(item => (
              <div key={item.productId} className="bg-white dark:bg-slate-900 p-6 rounded-[40px] border border-slate-100 dark:border-slate-800 flex gap-6 items-center shadow-sm">
                <img src={item.image} className="w-32 h-32 rounded-3xl object-cover shadow-lg" alt="" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black dark:text-white tracking-tight leading-tight">{item.name}</h3>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-blue-600 font-black text-lg mt-2 tracking-tighter">{formatCurrency(item.price, Currency.NGN)}</p>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-1 px-2 gap-4">
                      <button 
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="w-8 h-8 font-black dark:text-white hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
                      >
                        -
                      </button>
                      <span className="font-black dark:text-white text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-8 h-8 font-black dark:text-white hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-blue-500/5 sticky top-24">
              <h2 className="text-2xl font-black mb-10 dark:text-white tracking-tighter">Checkout Protocol</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-sm">Base Total</span>
                  <span className="font-black text-slate-900 dark:text-white">{formatCurrency(subtotal, Currency.NGN)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-sm">Logistics Fee</span>
                  <span className="font-black text-slate-900 dark:text-white">{formatCurrency(delivery, Currency.NGN)}</span>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-lg font-black dark:text-white">Net Order</span>
                  <span className="text-3xl font-black text-blue-600 tracking-tighter">{formatCurrency(total, Currency.NGN)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full bg-blue-600 text-white font-black py-6 rounded-[32px] mt-12 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-blue-600/30 disabled:opacity-50"
              >
                {checkingOut ? <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <><CreditCard size={22} /> Execute Payment</>}
              </button>
              <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" /> Paystack Secure Checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCart;
