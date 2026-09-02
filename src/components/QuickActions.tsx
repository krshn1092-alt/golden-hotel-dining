import React from 'react';
import { Bell, Receipt, ChefHat } from 'lucide-react';

interface QuickActionsProps {
  onCallWaiter: () => void;
  onRequestBill: () => void;
  onTrackOrder: () => void;
  hasItemsInCart: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCallWaiter,
  onRequestBill,
  onTrackOrder,
  hasItemsInCart,
}) => {
  return (
    <div
      id="quick-actions-bar"
      className={`fixed right-3 sm:right-4 z-40 flex flex-col gap-2.5 transition-all duration-300 ${
        hasItemsInCart 
          ? 'bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))]' 
          : 'bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]'
      }`}
    >
      <button
        id="quick-track-order-btn"
        onClick={onTrackOrder}
        className="group relative bg-[#181818]/90 backdrop-blur-md border border-[#d4af37]/40 hover:border-[#d4af37] p-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-[#d4af37] hover:brightness-125 transition active:scale-95 flex items-center justify-center cursor-pointer"
        title="Live Kitchen Status"
      >
        <ChefHat className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d4af37]"></span>
        </span>
        <span className="hidden sm:inline-block absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-[#1f1f1f] text-[11px] font-semibold text-[#d4af37] whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow-lg border border-[#d4af37]/30 pointer-events-none">
          Live Kitchen Tracker
        </span>
      </button>

      <button
        id="quick-call-waiter-btn"
        onClick={onCallWaiter}
        className="group relative bg-[#181818]/90 backdrop-blur-md border border-[#333] hover:border-[#d4af37] p-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-zinc-300 hover:text-[#d4af37] transition active:scale-95 flex items-center justify-center cursor-pointer"
        title="Call Waiter / Service"
      >
        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline-block absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-[#1f1f1f] text-[11px] font-medium text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow border border-[#333] pointer-events-none">
          Call Waiter
        </span>
      </button>

      <button
        id="quick-request-bill-btn"
        onClick={onRequestBill}
        className="group relative bg-[#181818]/90 backdrop-blur-md border border-[#333] hover:border-[#d4af37] p-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-zinc-300 hover:text-[#d4af37] transition active:scale-95 flex items-center justify-center cursor-pointer"
        title="Request Bill / Folio"
      >
        <Receipt className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline-block absolute right-full mr-2.5 px-2.5 py-1 rounded-lg bg-[#1f1f1f] text-[11px] font-medium text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition shadow border border-[#333] pointer-events-none">
          Request Bill
        </span>
      </button>
    </div>
  );
};
