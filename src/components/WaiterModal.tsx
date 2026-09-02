import React, { useState } from 'react';
import { Bell, Check, X, GlassWater, Sparkles, UserCheck, MessageSquarePlus } from 'lucide-react';

interface WaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatNumber: string;
  onTriggerAlert?: (reason: string, note?: string) => void;
}

export const WaiterModal: React.FC<WaiterModalProps> = ({ isOpen, onClose, seatNumber, onTriggerAlert }) => {
  const [selectedReason, setSelectedReason] = useState<string>('General Assistance');
  const [customNote, setCustomNote] = useState('');
  const [hasSent, setHasSent] = useState(false);

  if (!isOpen) return null;

  const quickReasons = [
    { label: 'Water & Glasses', icon: GlassWater },
    { label: 'Clean Table / Cutlery', icon: Sparkles },
    { label: 'Call Captain / Sommelier', icon: UserCheck },
    { label: 'General Assistance', icon: Bell },
  ];

  const handleSend = () => {
    setHasSent(true);
    if (onTriggerAlert) {
      onTriggerAlert(selectedReason, customNote.trim() || undefined);
    }
    setTimeout(() => {
      // Auto close after showing confirmation
      setTimeout(() => {
        setHasSent(false);
        onClose();
      }, 1500);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#141414] border border-[#2d2d2d] rounded-2xl p-6 max-w-sm w-full shadow-2xl text-left relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-full bg-[#1c1c1c] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!hasSent ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Call Waiter</h3>
                <p className="text-xs text-zinc-400">Notifying floor team for Table {seatNumber}</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-zinc-300 mb-2.5">What do you need assistance with?</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickReasons.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedReason === r.label;
                return (
                  <button
                    key={r.label}
                    onClick={() => setSelectedReason(r.label)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#d4af37]/15 border-[#d4af37] text-white shadow-sm'
                        : 'bg-[#1a1a1a] border-[#292929] text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#d4af37]' : 'text-zinc-400'}`} />
                    <span className="text-xs font-medium leading-tight">{r.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-5">
              <label className="text-xs text-zinc-400 block mb-1.5 flex items-center gap-1">
                <MessageSquarePlus className="w-3.5 h-3.5" />
                Additional Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Extra napkins, ice bucket..."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-[#333] text-xs font-semibold text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#b5952f] text-black text-xs font-bold transition shadow-[0_0_12px_rgba(212,175,55,0.3)] flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                Ring Waiter
              </button>
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="w-14 h-14 bg-[#d4af37]/20 border border-[#d4af37] rounded-full mx-auto flex items-center justify-center text-[#d4af37] mb-4 animate-bounce">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Floor Staff Notified</h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              A staff member has been dispatched to <strong>Table {seatNumber}</strong> for <em>"{selectedReason}"</em>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
