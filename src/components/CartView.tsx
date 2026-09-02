import React, { useState } from 'react';
import { ChevronLeft, Trash2, Plus, Minus, CreditCard, Banknote, QrCode, Sparkles, Utensils, GlassWater, Check } from 'lucide-react';
import { CartItem, MenuItem, PaymentMethod } from '../types';
import { getSmartPairing } from '../data/menu';

interface CartViewProps {
  cart: CartItem[];
  seatNumber: string;
  paymentMethod: PaymentMethod;
  onSetPaymentMethod: (pm: PaymentMethod) => void;
  onBackToMenu: () => void;
  onUpdateQty: (itemId: number, delta: number) => void;
  onRemoveItem: (itemId: number) => void;
  onUpdateInstruction: (index: number, instruction: string) => void;
  onPlaceOrder: () => void;
  onAddToCart: (item: MenuItem) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  seatNumber,
  paymentMethod,
  onSetPaymentMethod,
  onBackToMenu,
  onUpdateQty,
  onRemoveItem,
  onUpdateInstruction,
  onPlaceOrder,
  onAddToCart,
}) => {
  const [justAddedPairingId, setJustAddedPairingId] = useState<number | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.05);
  const total = subtotal + gst + serviceCharge;

  const smartPairing = getSmartPairing(cart);

  const handleAddPairingClick = (item: MenuItem) => {
    setJustAddedPairingId(item.id);
    onAddToCart(item);
    setTimeout(() => {
      setJustAddedPairingId(null);
    }, 1500);
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto text-left">
      <button
        onClick={onBackToMenu}
        className="inline-flex items-center text-[#d4af37] mb-5 font-semibold text-xs sm:text-sm hover:underline group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Menu
      </button>

      <div className="flex items-center justify-between mb-5 border-b border-[#262626] pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">Your Dining Order</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Serving to <strong className="text-[#d4af37]">Table {seatNumber}</strong>
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1e1e1e] text-zinc-300 border border-[#333]">
          {cart.reduce((a, c) => a + c.qty, 0)} items
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="py-16 text-center bg-[#131313] border border-[#262626] rounded-2xl p-8">
          <div className="w-12 h-12 rounded-full bg-[#1c1c1c] text-zinc-500 mx-auto flex items-center justify-center mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-zinc-300">Your order is currently empty.</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
            Explore our curated culinary selections and add items to place your table order.
          </p>
          <button
            onClick={onBackToMenu}
            className="mt-5 bg-[#d4af37] hover:bg-[#b5952f] text-black text-xs font-bold px-5 py-2.5 rounded-xl transition"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* List of Cart Items */}
          <div className="space-y-3">
            {cart.map((cartItem, idx) => (
              <div
                key={cartItem.item.id}
                className="bg-[#141414] border border-[#242424] rounded-xl p-4 transition-all"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <img
                      src={cartItem.item.img}
                      alt={cartItem.item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {cartItem.item.name}
                      </h4>
                      <p className="text-xs text-[#d4af37] font-semibold mt-0.5">
                        ₹{cartItem.item.price} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Delete Controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#1e1e1e] border border-[#333] rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQty(cartItem.item.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">
                        {cartItem.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(cartItem.item.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveItem(cartItem.item.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Swiggy/Zomato style Special Instruction input */}
                <div className="mt-3 pt-2.5 border-t border-[#1f1f1f]">
                  <input
                    type="text"
                    placeholder="Add cooking notes (e.g. Extra spicy, no onions, well done)..."
                    value={cartItem.instruction}
                    onChange={(e) => onUpdateInstruction(idx, e.target.value)}
                    className="w-full bg-[#0c0c0c] border border-[#292929] rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI SMART PAIRING / CHEF'S RECOMMENDATION UP-SELL SECTION */}
          {smartPairing && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#181611]/90 via-[#141414]/95 to-[#121212] border border-[#d4af37]/40 p-4 sm:p-5 shadow-[0_0_30px_rgba(212,175,55,0.12)] transition-all duration-300">
              {/* Subtle Glowing Background Pulse */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Header Label */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37]/25 to-[#d4af37]/10 border border-[#d4af37]/50 text-[#d4af37] text-[11px] font-extrabold tracking-wider uppercase shadow-[0_0_12px_rgba(212,175,55,0.2)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin-slow" />
                  <span>AI Smart Pairing • Chef's Recommendation</span>
                </div>
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <GlassWater className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Curated to match your meal</span>
                </span>
              </div>

              {/* Reason Description */}
              <div className="relative z-10 mb-3 bg-[#0d0d0d]/80 border border-[#2b2515] rounded-xl px-3 py-2 text-xs text-zinc-300 leading-relaxed">
                <span className="text-[#d4af37] font-semibold">Pairs with {smartPairing.triggeredByName}:</span>{' '}
                <span className="text-zinc-400 italic">"{smartPairing.reason}"</span>
              </div>

              {/* Pairing Item Card */}
              <div className="relative z-10 flex items-center justify-between gap-3 bg-[#111111] border border-[#2e2a1e] rounded-xl p-3 sm:p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={smartPairing.item.img}
                      alt={smartPairing.item.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#d4af37]/40 shadow-md bg-black"
                    />
                    {smartPairing.item.isChefSpecial && (
                      <span className="absolute -top-1.5 -left-1.5 bg-[#d4af37] text-black text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                        TOP
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] block truncate">
                      {smartPairing.item.categoryLabel || 'Signature Drink'}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      {smartPairing.item.name}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1 hidden xs:block">
                      {smartPairing.item.desc}
                    </p>
                    <p className="text-xs sm:text-sm font-extrabold text-[#d4af37] mt-0.5">
                      ₹{smartPairing.item.price}
                    </p>
                  </div>
                </div>

                <button
                  id="add-smart-pairing-btn"
                  type="button"
                  onClick={() => handleAddPairingClick(smartPairing.item)}
                  disabled={justAddedPairingId === smartPairing.item.id}
                  className={`shrink-0 font-extrabold text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    justAddedPairingId === smartPairing.item.id
                      ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                      : 'bg-gradient-to-r from-[#d4af37] via-[#e5c76b] to-[#d4af37] hover:brightness-115 text-black shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                  }`}
                  title={`Add ${smartPairing.item.name} to order`}
                >
                  {justAddedPairingId === smartPairing.item.id ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added ✓</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Add {smartPairing.item.name} - +₹{smartPairing.item.price}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Payment Preference
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onSetPaymentMethod('table')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 cursor-pointer ${
                  paymentMethod === 'table'
                    ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-sm'
                    : 'bg-[#1a1a1a] text-zinc-400 border-[#2b2b2b] hover:border-zinc-500'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Pay at Table</span>
              </button>
              <button
                type="button"
                onClick={() => onSetPaymentMethod('online')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 cursor-pointer ${
                  paymentMethod === 'online'
                    ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-sm'
                    : 'bg-[#1a1a1a] text-zinc-400 border-[#2b2b2b] hover:border-zinc-500'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Online Gateway</span>
              </button>
              <button
                type="button"
                onClick={() => onSetPaymentMethod('upi')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-sm'
                    : 'bg-[#1a1a1a] text-zinc-400 border-[#2b2b2b] hover:border-zinc-500'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI Scan</span>
              </button>
              <button
                type="button"
                onClick={() => onSetPaymentMethod('card')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition flex flex-col items-center gap-1 cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-sm'
                    : 'bg-[#1a1a1a] text-zinc-400 border-[#2b2b2b] hover:border-zinc-500'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card Machine</span>
              </button>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Items Total</span>
              <span className="text-white font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Taxes & GST (5%)</span>
              <span>₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Service Charge (5%)</span>
              <span>₹{serviceCharge.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-[#262626] flex justify-between text-sm font-bold text-[#d4af37]">
              <span>To Pay</span>
              <span className="text-base font-extrabold">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            onClick={onPlaceOrder}
            className="w-full bg-gradient-to-r from-[#d4af37] via-[#e5c76b] to-[#d4af37] text-black text-sm sm:text-base font-extrabold py-4 rounded-xl hover:brightness-110 active:scale-[0.99] transition shadow-[0_4px_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Confirm & Send to Kitchen</span>
            <span>•</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

