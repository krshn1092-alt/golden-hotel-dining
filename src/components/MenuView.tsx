import React, { useState } from 'react';
import { Search, Plus, Minus, Sparkles, Flame, Eye } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { CATEGORIES } from '../data/menu';

interface MenuViewProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQty: (itemId: number, delta: number) => void;
  onOpenDetail: (item: MenuItem) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  menuItems,
  cart,
  onAddToCart,
  onUpdateQty,
  onOpenDetail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'nonveg' | 'special'>('all');

  const filteredItems = menuItems.filter((item) => {
    // Category match
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    // Dietary filter
    if (dietaryFilter === 'veg' && !item.isVeg) return false;
    if (dietaryFilter === 'nonveg' && item.isVeg) return false;
    if (dietaryFilter === 'special' && !item.isChefSpecial) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCartItemQty = (itemId: number) => {
    const found = cart.find((c) => c.item.id === itemId);
    return found ? found.qty : 0;
  };

  return (
    <div className="space-y-6">
      {/* Search & Dietary Filter Strip */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cuisine, craft cocktails, pizzas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#262626] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#d4af37] transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition select-none ${
                  isSelected
                    ? 'bg-[#d4af37] text-black shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                    : 'bg-[#161616] text-zinc-400 border border-[#282828] hover:border-zinc-500 hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dietary Badges filter */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setDietaryFilter('all')}
            className={`px-2.5 py-1 rounded-md transition ${
              dietaryFilter === 'all'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            All Choices
          </button>
          <button
            onClick={() => setDietaryFilter('veg')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 border transition ${
              dietaryFilter === 'veg'
                ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/60 font-semibold'
                : 'bg-[#121212] text-zinc-400 border-[#262626] hover:border-emerald-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Pure Veg
          </button>
          <button
            onClick={() => setDietaryFilter('nonveg')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 border transition ${
              dietaryFilter === 'nonveg'
                ? 'bg-rose-950/70 text-rose-400 border-rose-500/60 font-semibold'
                : 'bg-[#121212] text-zinc-400 border-[#262626] hover:border-rose-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            Non-Veg
          </button>
          <button
            onClick={() => setDietaryFilter('special')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 border transition ${
              dietaryFilter === 'special'
                ? 'bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37] font-semibold'
                : 'bg-[#121212] text-zinc-400 border-[#262626] hover:border-[#d4af37]/40'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            Chef's Pick
          </button>
        </div>
      </div>

      {/* Grid of Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 bg-[#121212] rounded-2xl border border-[#242424] p-8">
          <p className="text-sm font-medium">No dishes match your selection.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setDietaryFilter('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-[#d4af37] underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map((item) => {
            const qtyInCart = getCartItemQty(item.id);

            return (
              <div
                key={item.id}
                id={`menu-item-${item.id}`}
                className="group bg-[#131313] rounded-2xl overflow-hidden border border-[#242424] hover:border-[#d4af37]/40 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
              >
                {/* Food Image Container */}
                <div className="relative h-48 w-full bg-[#1a1a1a] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-black/20" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${
                        item.isVeg
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                          : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
                      }`}
                    >
                      {item.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                    {item.isChefSpecial && (
                      <span className="bg-[#d4af37] text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" /> Special
                      </span>
                    )}
                  </div>

                  {/* Quick Detail View Button */}
                  <button
                    onClick={() => onOpenDetail(item)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/90 flex items-center justify-center transition shadow-md"
                    title="View Dish Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                    <span className="text-xs text-[#d4af37] font-semibold tracking-wider uppercase">
                      {item.categoryLabel}
                    </span>
                    {item.spicyLevel !== undefined && item.spicyLevel > 0 && (
                      <span className="flex items-center text-[11px] text-amber-400 font-medium bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        <Flame className="w-3 h-3 mr-0.5 inline" /> {item.spicyLevel}★
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="cursor-pointer" onClick={() => onOpenDetail(item)}>
                    <h3 className="text-base font-bold text-white group-hover:text-[#d4af37] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#202020]">
                    <div>
                      <span className="text-lg font-extrabold text-[#d4af37]">
                        ₹{item.price}
                      </span>
                      {item.calories && (
                        <span className="text-[10px] text-zinc-500 block">
                          {item.calories}
                        </span>
                      )}
                    </div>

                    {qtyInCart > 0 ? (
                      <div className="flex items-center bg-[#1f1f1f] border border-[#d4af37]/60 rounded-xl p-0.5 shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-[#2e2e2e] active:scale-95 transition"
                          title="Decrease Quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#d4af37]">
                          {qtyInCart}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-white hover:bg-[#2e2e2e] active:scale-95 transition"
                          title="Increase Quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onAddToCart(item)}
                        className="bg-[#d4af37] hover:bg-[#c49f2b] active:scale-95 text-black px-4 py-2 rounded-xl text-xs font-bold transition shadow-[0_2px_10px_rgba(212,175,55,0.2)] flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
