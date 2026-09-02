import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingCartBarProps {
  cart: CartItem[];
  onViewCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ cart, onViewCart }) => {
  if (cart.length === 0) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.item.price * item.qty, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 z-40 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-2xl mx-auto w-full pointer-events-auto px-1">
        <button
          onClick={onViewCart}
          className="w-full bg-gradient-to-r from-[#d4af37] via-[#e5c76b] to-[#d4af37] text-black px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-[0_8px_30px_rgba(212,175,55,0.45)] flex justify-between items-center font-bold text-sm sm:text-base hover:scale-[1.01] active:scale-[0.99] transition transform cursor-pointer border border-[#f5dc8e]/40"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-black/15 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-black" />
            </div>
            <div className="text-left truncate">
              <span className="font-black leading-tight block text-xs sm:text-sm">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Added
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-black/80 block truncate">
                Tap to customize & review
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm sm:text-base font-black">₹{cartTotal.toLocaleString('en-IN')}</span>
            <div className="w-7 h-7 rounded-full bg-black text-[#d4af37] flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
