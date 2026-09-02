import React, { useState } from 'react';
import { X, Plus, Minus, Flame, Clock, Sparkles, Check, ShoppingBag, ArrowLeft, ChevronLeft } from 'lucide-react';
import { MenuItem } from '../types';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, qty: number, instruction: string) => void;
  currentQtyInCart: number;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [qty, setQty] = useState(1);
  const [instruction, setInstruction] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!item) return null;

  const handleAdd = () => {
    onAddToCart(item, qty, instruction);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#141414] border border-[#2b2b2b] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative text-left">
        {/* Prominent Back to Menu Button at Absolute Top-Left Corner */}
        <button
          id="item-detail-back-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md border border-[#d4af37]/40 hover:border-[#d4af37] text-white hover:text-[#d4af37] text-xs font-bold shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all active:scale-95 group cursor-pointer"
          title="Back to Menu"
        >
          <ChevronLeft className="w-4 h-4 text-[#d4af37] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Menu</span>
        </button>

        {/* Top-Right Quick Close Button */}
        <button
          id="item-detail-close-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md border border-white/15 text-white hover:text-[#d4af37] flex items-center justify-center transition active:scale-95 cursor-pointer shadow-lg"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Food Image */}
        <div className="relative h-64 w-full bg-[#1c1c1c] overflow-hidden">
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/50" />
          
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
            {item.isChefSpecial && (
              <span className="bg-[#d4af37] text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Sparkles className="w-3 h-3" /> Chef's Signature
              </span>
            )}
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
              item.isVeg
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
            }`}>
              {item.isVeg ? 'VEG' : 'NON-VEG'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white font-serif">{item.name}</h2>
              <p className="text-xs text-[#d4af37] font-medium tracking-wide uppercase mt-0.5">
                {item.categoryLabel}
              </p>
            </div>
            <span className="text-2xl font-extrabold text-[#d4af37]">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
            {item.desc}
          </p>

          {/* Quick Specs */}
          <div className="flex items-center gap-4 py-2 border-y border-[#262626] text-xs text-zinc-400">
            {item.prepTime && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{item.prepTime}</span>
              </div>
            )}
            {item.calories && (
              <div>
                <span>{item.calories}</span>
              </div>
            )}
            {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
              <div className="flex items-center gap-1 text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                <span>Spicy Level: {item.spicyLevel}/3</span>
              </div>
            )}
          </div>

          {/* Sommelier & Chef's Smart Pairing Suggestion */}
          <div className="bg-[#0c0c0c] border border-[#2e2a1b] rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="text-zinc-300">
                <strong className="text-[#d4af37]">Chef's Pairing:</strong>{' '}
                {item.category === 'pizzas' || item.category === 'pasta'
                  ? 'Midnight Espresso Martini'
                  : item.category === 'burgers' || item.category === 'mains'
                  ? 'Classic Cuban Mojito'
                  : item.category === 'cocktails'
                  ? 'Dark Chocolate Lava Fondant'
                  : 'Midnight Espresso Martini'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider shrink-0">
              AI Curated
            </span>
          </div>

          {/* Special Customization Note */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Preparation Notes / Allergies
            </label>
            <input
              type="text"
              placeholder="e.g. Less spicy, dressing on side, gluten-free crust..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Add & Quantity Bar */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex items-center bg-[#1f1f1f] border border-[#333] rounded-xl p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-[#2b2b2b] transition"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-[#2b2b2b] transition"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={addedAnimation}
              className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b5952f] text-black font-bold text-sm py-3.5 px-4 rounded-xl shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" /> Added to Order
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart • ₹{item.price * qty}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
