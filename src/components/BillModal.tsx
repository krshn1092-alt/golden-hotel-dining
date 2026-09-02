import React, { useState } from 'react';
import { Receipt, X, Check, CreditCard, Banknote, QrCode, Users, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatNumber: string;
  cart: CartItem[];
  placedOrdersTotal: number;
  onTriggerBillAlert?: (payMode: string, tipAmount: number) => void;
}

export const BillModal: React.FC<BillModalProps> = ({
  isOpen,
  onClose,
  seatNumber,
  cart,
  placedOrdersTotal,
  onTriggerBillAlert,
}) => {
  const [tipMode, setTipMode] = useState<'preset' | 'custom'>('preset');
  const [tipPercent, setTipPercent] = useState<number>(0);
  const [customTipAmount, setCustomTipAmount] = useState<string>('');
  const [splitCount, setSplitCount] = useState<number>(1);
  const [selectedPayMode, setSelectedPayMode] = useState<'card' | 'cash' | 'upi'>('upi');
  const [isRequested, setIsRequested] = useState(false);

  if (!isOpen) return null;

  const currentCartTotal = cart.reduce((acc, i) => acc + i.item.price * i.qty, 0);
  const baseSubtotal = placedOrdersTotal > 0 ? placedOrdersTotal : (currentCartTotal > 0 ? currentCartTotal : 1598); // fallback sample if no items
  const gst = Math.round(baseSubtotal * 0.05); // 5% GST
  const serviceCharge = Math.round(baseSubtotal * 0.05); // 5% Service charge
  
  const parsedCustomTip = parseInt(customTipAmount, 10) || 0;
  const tipAmount = tipMode === 'custom' 
    ? parsedCustomTip 
    : Math.round(baseSubtotal * (tipPercent / 100));

  const grandTotal = baseSubtotal + gst + serviceCharge + tipAmount;
  const perPersonAmount = Math.ceil(grandTotal / splitCount);

  const handleSelectPreset = (pct: number) => {
    setTipMode('preset');
    setTipPercent(pct);
    setCustomTipAmount('');
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setCustomTipAmount(val);
      setTipMode('custom');
    }
  };

  const handleRequestBill = () => {
    setIsRequested(true);
    if (onTriggerBillAlert) {
      onTriggerBillAlert(selectedPayMode.toUpperCase(), tipAmount);
    }
    setTimeout(() => {
      setTimeout(() => {
        setIsRequested(false);
        onClose();
      }, 1800);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-2xl p-6 max-w-md w-full shadow-2xl text-left relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full bg-[#1c1c1c] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!isRequested ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Table Bill & Checkout</h3>
                <p className="text-xs text-zinc-400">Review check for Table {seatNumber}</p>
              </div>
            </div>

            {/* Bill Slip Design */}
            <div className="bg-[#0f0f0f] border border-[#262626] rounded-xl p-4 mb-4 font-mono text-xs space-y-2 text-zinc-300">
              <div className="flex justify-between border-b border-[#262626] pb-2 text-[11px] uppercase tracking-wider text-zinc-500">
                <span>Description</span>
                <span>Amount (₹)</span>
              </div>
              <div className="flex justify-between">
                <span>Food & Beverages Subtotal</span>
                <span className="font-semibold text-white">₹{baseSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>GST (5%)</span>
                <span>₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Service Charge (5%)</span>
                <span>₹{serviceCharge.toLocaleString('en-IN')}</span>
              </div>
              {tipAmount > 0 && (
                <div className="flex justify-between text-[#d4af37]">
                  <span>
                    Staff Tip {tipMode === 'preset' ? `(${tipPercent}%)` : `(Custom Amount)`}
                  </span>
                  <span>₹{tipAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-[#333] pt-2 mt-2 flex justify-between text-sm font-sans font-bold text-[#d4af37]">
                <span>Grand Total</span>
                <span className="text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Dynamic Staff Tip Selection */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  Add Staff Tip
                </span>
                {tipAmount > 0 && (
                  <span className="text-[#d4af37] font-semibold text-[11px]">
                    +₹{tipAmount.toLocaleString('en-IN')} added
                  </span>
                )}
              </label>

              {/* Preset Buttons: None, 1%, 2%, 3%, 4% */}
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 1, 2, 3, 4].map((pct) => {
                  const isSelected = tipMode === 'preset' && tipPercent === pct;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSelectPreset(pct)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                        isSelected
                          ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.25)]'
                          : 'bg-[#181818] text-zinc-400 border-[#2b2b2b] hover:border-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      {pct === 0 ? 'None' : `${pct}%`}
                    </button>
                  );
                })}
              </div>

              {/* Custom Tip Amount (₹) Input */}
              <div className="mt-2.5 relative">
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-zinc-400">₹</span>
                  <input
                    id="custom-tip-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="Custom Amount (₹)"
                    value={customTipAmount}
                    onChange={handleCustomTipChange}
                    className={`w-full bg-[#0d0d0d] border rounded-xl pl-7 pr-16 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition ${
                      tipMode === 'custom' && customTipAmount
                        ? 'border-[#d4af37] ring-1 ring-[#d4af37]/40 shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                        : 'border-[#2b2b2b] focus:border-[#d4af37]'
                    }`}
                  />
                  {tipMode === 'custom' && customTipAmount && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomTipAmount('');
                        setTipMode('preset');
                        setTipPercent(0);
                      }}
                      className="absolute right-3 text-[11px] text-[#d4af37] hover:underline font-medium cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Split Bill Calculator */}
            <div className="mb-4 bg-[#181818] p-3 rounded-xl border border-[#2b2b2b]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                  Split Bill
                </span>
                <span className="text-[#d4af37] font-bold">₹{perPersonAmount.toLocaleString('en-IN')} / person</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSplitCount(num)}
                    className={`flex-1 py-1 rounded-md text-xs font-medium border ${
                      splitCount === num
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                        : 'bg-[#101010] border-[#2a2a2a] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Choice */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedPayMode('upi')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedPayMode === 'upi'
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-white'
                      : 'bg-[#181818] border-[#292929] text-zinc-400'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-[11px] font-medium">Instant UPI</span>
                </button>
                <button
                  onClick={() => setSelectedPayMode('card')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedPayMode === 'card'
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-white'
                      : 'bg-[#181818] border-[#292929] text-zinc-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-[11px] font-medium">Card POS</span>
                </button>
                <button
                  onClick={() => setSelectedPayMode('cash')}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedPayMode === 'cash'
                      ? 'bg-[#d4af37]/15 border-[#d4af37] text-white'
                      : 'bg-[#181818] border-[#292929] text-zinc-400'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-[11px] font-medium">Table Cash</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[#333] text-xs font-semibold text-zinc-400 hover:text-white transition"
              >
                Close
              </button>
              <button
                onClick={handleRequestBill}
                className="flex-1 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#b5952f] text-black text-xs font-bold transition shadow-[0_0_12px_rgba(212,175,55,0.3)] flex items-center justify-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                Request Final Bill
              </button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="w-14 h-14 bg-[#d4af37]/20 border border-[#d4af37] rounded-full mx-auto flex items-center justify-center text-[#d4af37] mb-4 animate-bounce">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Bill Requested</h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Our floor manager is bringing the printed folio and {selectedPayMode.toUpperCase()} terminal to <strong>Table {seatNumber}</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
