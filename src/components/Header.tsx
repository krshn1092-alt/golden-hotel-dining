import React, { useState, useRef } from 'react';
import { UtensilsCrossed, ChevronDown, Check, Sparkles, ChefHat } from 'lucide-react';

interface HeaderProps {
  seatNumber: string;
  onSeatChange: (newSeat: string) => void;
  onLogoClick: () => void;
  onTrackOrder: () => void;
  onSecretAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  seatNumber, 
  onSeatChange, 
  onLogoClick, 
  onTrackOrder,
  onSecretAdmin 
}) => {
  const [isChangingSeat, setIsChangingSeat] = useState(false);
  const [customSeat, setCustomSeat] = useState('');
  const clickTimestampsRef = useRef<number[]>([]);

  const handleBrandClick = () => {
    const now = Date.now();
    // Filter timestamps within the last 1500ms
    const recentClicks = clickTimestampsRef.current.filter((t) => now - t < 1500);
    recentClicks.push(now);
    clickTimestampsRef.current = recentClicks;

    if (recentClicks.length >= 3) {
      clickTimestampsRef.current = [];
      if (onSecretAdmin) {
        onSecretAdmin();
      } else {
        onLogoClick();
      }
    } else {
      onLogoClick();
    }
  };

  const standardTables = ["1", "2", "3", "4", "5", "VIP 1", "VIP 2", "Balcony A", "Walk-in"];

  const handleSelectSeat = (seat: string) => {
    onSeatChange(seat);
    setIsChangingSeat(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSeat.trim()) {
      onSeatChange(customSeat.trim());
      setCustomSeat('');
      setIsChangingSeat(false);
    }
  };

  return (
    <>
      <header id="app-header" className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#262626] shadow-xl px-3.5 sm:px-6 py-3 sm:py-3.5 flex justify-between items-center transition-all pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
        <div 
          id="header-brand-container"
          onClick={handleBrandClick} 
          className="cursor-pointer group flex items-center gap-2.5 sm:gap-3 select-none min-w-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8c7322] p-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition shrink-0">
            <div className="w-full h-full bg-[#121212] rounded-[11px] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-xl font-bold tracking-widest text-[#f3f3f3] font-serif group-hover:text-[#d4af37] transition-colors truncate">
                THE MIDNIGHT
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 tracking-wider uppercase shrink-0">
                <Sparkles className="w-2.5 h-2.5 mr-0.5 sm:mr-1 inline" />
                Lounge
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-zinc-400 uppercase tracking-widest mt-0.5 font-medium truncate">
              Fine Dining & Cocktail Bar
            </p>
          </div>
        </div>

        {/* Right Header Actions: Track Order & Table Badge */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Live Kitchen Tracker Direct Button */}
          <button
            id="header-track-order-btn"
            onClick={onTrackOrder}
            className="bg-gradient-to-r from-[#d4af37]/20 to-[#b5952f]/10 hover:from-[#d4af37]/30 hover:to-[#b5952f]/20 border border-[#d4af37]/50 hover:border-[#d4af37] text-[#d4af37] px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-1.5 shadow-[0_0_12px_rgba(212,175,55,0.15)] transition active:scale-95 cursor-pointer group"
            title="Track Kitchen Order / Live Status"
          >
            <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#d4af37] group-hover:rotate-12 transition-transform" />
            <span className="hidden xs:inline">Track Order</span>
            <span className="xs:hidden">Status</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
            </span>
          </button>

          {/* Table Badge with interactive selector */}
          <button
            id="table-selector-btn"
            onClick={() => setIsChangingSeat(true)}
            className="bg-[#181818] hover:bg-[#202020] text-[#d4af37] border border-[#d4af37]/30 hover:border-[#d4af37] px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2 shadow-sm transition active:scale-95 whitespace-nowrap"
            title="Change Table Number"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#d4af37]"></span>
            <span>TABLE <strong className="text-white font-bold">{seatNumber}</strong></span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400" />
          </button>
        </div>
      </header>

      {/* Table Change Modal */}
      {isChangingSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#141414] border border-[#333] rounded-2xl p-6 max-w-sm w-full shadow-2xl text-left">
            <h3 className="text-lg font-bold text-white mb-1">Select Your Table</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Scanned table QR or dining at a specific booth?
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {standardTables.map((seat) => (
                <button
                  key={seat}
                  onClick={() => handleSelectSeat(seat)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition flex items-center justify-center gap-1 ${
                    seatNumber === seat
                      ? 'bg-[#d4af37] text-black border-[#d4af37]'
                      : 'bg-[#1e1e1e] text-zinc-300 border-[#2d2d2d] hover:border-[#d4af37]/60'
                  }`}
                >
                  {seatNumber === seat && <Check className="w-3 h-3" />}
                  {seat.startsWith('VIP') || seat.startsWith('Walk') || seat.startsWith('Balcony') ? seat : `T-${seat}`}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Custom Table / Booth #"
                  value={customSeat}
                  onChange={(e) => setCustomSeat(e.target.value)}
                  className="flex-1 bg-[#0d0d0d] border border-[#333] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
                />
                <button
                  type="submit"
                  className="bg-[#d4af37] hover:bg-[#b5952f] text-black text-xs font-bold px-4 py-2 rounded-lg transition"
                >
                  Set
                </button>
              </div>
            </form>

            <button
              onClick={() => setIsChangingSeat(false)}
              className="mt-4 w-full py-2 text-xs text-zinc-400 hover:text-white border border-[#2d2d2d] rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
