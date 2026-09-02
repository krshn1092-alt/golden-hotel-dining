import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Utensils, Bell, Receipt, PlusCircle, ChefHat, Flame, Sparkles, ArrowLeft, ShoppingBag } from 'lucide-react';
import { OrderRecord } from '../types';

interface OrderPlacedViewProps {
  lastOrder: OrderRecord | null;
  orderCompletionTime: number | null;
  seatNumber: string;
  onOrderMore: () => void;
  onCallWaiter: () => void;
  onRequestBill: () => void;
}

export const OrderPlacedView: React.FC<OrderPlacedViewProps> = ({
  lastOrder,
  orderCompletionTime,
  seatNumber,
  onOrderMore,
  onCallWaiter,
  onRequestBill,
}) => {
  // Real-time remaining countdown calculation
  const getRemainingSeconds = () => {
    if (!orderCompletionTime) return 0;
    const diffMs = orderCompletionTime - Date.now();
    return Math.max(0, Math.floor(diffMs / 1000));
  };

  const [remainingSeconds, setRemainingSeconds] = useState<number>(getRemainingSeconds());
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  useEffect(() => {
    if (!orderCompletionTime) return;

    // Synchronize immediately
    setRemainingSeconds(getRemainingSeconds());

    const timer = setInterval(() => {
      const remaining = getRemainingSeconds();
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [orderCompletionTime]);

  // If no order has been placed yet, show the Empty State
  if (!lastOrder || !orderCompletionTime) {
    return (
      <div className="animate-fade-in max-w-lg mx-auto text-center space-y-6 pb-6 pt-4">
        {/* Top-Left Back Arrow Button */}
        <div className="flex justify-start items-center w-full">
          <button
            id="tracker-empty-back-btn"
            onClick={onOrderMore}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#d4af37] text-zinc-300 hover:text-[#d4af37] text-xs font-semibold shadow-md transition-all active:scale-95 group cursor-pointer"
            title="Back to Menu"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Menu</span>
          </button>
        </div>

        {/* Empty State Hero Container */}
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-5">
          <div className="w-20 h-20 bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/40 rounded-full mx-auto flex items-center justify-center text-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <ChefHat className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 uppercase tracking-widest">
              Table {seatNumber} • Live Kitchen
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
              No Active Kitchen Orders
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
              No active orders. Please place an order from the menu. Once confirmed, your ticket timeline and live countdown will appear here.
            </p>
          </div>

          <div className="pt-2">
            <button
              id="empty-explore-menu-btn"
              onClick={onOrderMore}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] via-[#e5c76b] to-[#d4af37] text-black font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Midnight Menu</span>
            </button>
          </div>
        </div>

        {/* Quick Assistance Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onCallWaiter}
            className="py-3 px-4 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2b2b2b] text-zinc-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-[#d4af37]" />
            <span>Call Waiter</span>
          </button>
          <button
            onClick={onRequestBill}
            className="py-3 px-4 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2b2b2b] text-zinc-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-[#d4af37]" />
            <span>Request Bill</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Order Calculation
  const minutesRemaining = Math.floor(remainingSeconds / 60);
  const secondsRemaining = remainingSeconds % 60;

  // Derive active stage based on real elapsed time (15 mins total)
  // Step 1 (Received): first 2 minutes (remaining > 13 mins)
  // Step 2 (Prepping): 13 mins to 4 mins (remaining > 4 mins)
  // Step 3 (Plated): 4 mins to 0 mins (remaining > 0)
  // Step 4 (Served): 0 mins
  let currentDerivedStep = 2;
  if (remainingSeconds > 13 * 60) {
    currentDerivedStep = 1;
  } else if (remainingSeconds > 4 * 60) {
    currentDerivedStep = 2;
  } else if (remainingSeconds > 0) {
    currentDerivedStep = 3;
  } else {
    currentDerivedStep = 4;
  }

  const activeStep = selectedStep !== null ? selectedStep : currentDerivedStep;

  const steps = [
    { num: 1, title: 'Received', icon: CheckCircle, desc: 'Kitchen acknowledged ticket and queued order' },
    { num: 2, title: 'Prepping', icon: ChefHat, desc: 'Executive chefs firing pans & artisan charcoal' },
    { num: 3, title: 'Plated', icon: Flame, desc: 'Garnished, temperature audited & passed' },
    { num: 4, title: 'Served', icon: Utensils, desc: 'Course delivered to Table ' + seatNumber },
  ];

  return (
    <div className="animate-fade-in max-w-xl mx-auto text-center space-y-6 pb-6 relative">
      {/* Top-Left Back Arrow Button */}
      <div className="flex justify-start items-center w-full">
        <button
          id="tracker-back-to-menu-btn"
          onClick={onOrderMore}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#d4af37] text-zinc-300 hover:text-[#d4af37] text-xs font-semibold shadow-md transition-all active:scale-95 group cursor-pointer"
          title="Back to Menu"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Menu</span>
        </button>
      </div>

      {/* Top Banner */}
      <div className="pt-1">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37] rounded-full mx-auto flex items-center justify-center text-[#d4af37] mb-4 shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-pulse">
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 uppercase tracking-widest mb-2">
          <Sparkles className="w-3 h-3" /> Live Kitchen Ticket
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
          {remainingSeconds === 0 ? 'Order Ready!' : 'Order Dispatched!'}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          {remainingSeconds === 0
            ? `Your feast is prepared and being served at Table ${seatNumber}.`
            : `Your order is actively being prepared for Table ${seatNumber}.`}
        </p>
      </div>

      {/* Countdown Card */}
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden text-left">
        <div className="flex justify-between items-center pb-4 border-b border-[#242424]">
          <div>
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold block">
              Estimated Wait Time
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#d4af37] font-mono">
                {String(minutesRemaining).padStart(2, '0')}:{String(secondsRemaining).padStart(2, '0')}
              </span>
              <span className="text-xs text-zinc-400">
                {remainingSeconds === 0 ? 'serving now' : 'mins remaining'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold block">
              Order Ref
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-white">
              {lastOrder.id}
            </span>
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="pt-5 space-y-4">
          <div className="grid grid-cols-4 gap-2 text-center relative">
            {steps.map((s) => {
              const isPastOrCurrent = currentDerivedStep >= s.num;
              const isSelected = activeStep === s.num;
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  onClick={() => setSelectedStep(s.num)}
                  className="cursor-pointer flex flex-col items-center group"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#d4af37] text-black ring-4 ring-[#d4af37]/20 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                        : isPastOrCurrent
                        ? 'bg-[#292929] text-[#d4af37] border border-[#d4af37]/60'
                        : 'bg-[#181818] text-zinc-600 border border-[#242424]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold tracking-wide ${
                      isPastOrCurrent || isSelected ? 'text-white' : 'text-zinc-500'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-[#0f0f0f] border border-[#222] p-3 rounded-xl flex items-center gap-2 text-xs text-zinc-300">
            <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>
              {steps[activeStep - 1]?.desc || 'Preparing with perfection for your table.'}
            </span>
          </div>
        </div>
      </div>

      {/* Items Ordered List Accordion */}
      {lastOrder.items && lastOrder.items.length > 0 && (
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 text-left">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
            Ticket Summary
          </h4>
          <div className="space-y-2 text-xs divide-y divide-[#202020]">
            {lastOrder.items.map((cartItem, idx) => (
              <div key={idx} className="pt-2 first:pt-0 flex justify-between items-start">
                <div>
                  <span className="font-semibold text-white">
                    {cartItem.qty}x {cartItem.item.name}
                  </span>
                  {cartItem.instruction && (
                    <p className="text-[11px] text-amber-300/80 italic mt-0.5">
                      Note: "{cartItem.instruction}"
                    </p>
                  )}
                </div>
                <span className="text-zinc-300 font-mono">
                  ₹{cartItem.item.price * cartItem.qty}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={onOrderMore}
          className="py-3 px-4 rounded-xl bg-[#d4af37] hover:bg-[#b5952f] text-black text-xs font-bold transition flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(212,175,55,0.2)] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Order More Food
        </button>
        <button
          onClick={onCallWaiter}
          className="py-3 px-4 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#333] text-zinc-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Bell className="w-4 h-4 text-[#d4af37]" />
          Call Waiter
        </button>
        <button
          onClick={onRequestBill}
          className="py-3 px-4 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#333] text-zinc-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Receipt className="w-4 h-4 text-[#d4af37]" />
          Request Bill
        </button>
      </div>
    </div>
  );
};

