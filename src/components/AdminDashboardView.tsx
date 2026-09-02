import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Receipt, 
  ChefHat, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Clock, 
  Check, 
  Trash2, 
  Sparkles, 
  Flame, 
  Utensils, 
  Plus, 
  Volume2, 
  VolumeX, 
  ShieldAlert,
  BarChart3,
  RefreshCw,
  Wine
} from 'lucide-react';
import { StaffAlert, OrderRecord } from '../types';

interface AdminDashboardViewProps {
  onBackToRestaurant: () => void;
  staffAlerts: StaffAlert[];
  onResolveAlert: (id: string) => void;
  onClearAllAlerts: () => void;
  onAddTestAlert?: (type: 'Waiter' | 'Bill', tableNo: string, note?: string) => void;
  sessionOrders: OrderRecord[];
  sessionTotal: number;
}

interface KitchenTicket {
  id: string;
  table: string;
  items: { name: string; qty: number; notes?: string }[];
  total: number;
  payment: string;
  timeAgo: string;
  status: 'received' | 'preparing' | 'ready' | 'served';
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onBackToRestaurant,
  staffAlerts,
  onResolveAlert,
  onClearAllAlerts,
  onAddTestAlert,
  sessionOrders,
  sessionTotal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'alerts' | 'kitchen' | 'analytics'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initial simulated tickets combined with any real session orders
  const initialSimulatedTickets: KitchenTicket[] = [
    {
      id: '#MDN-9021',
      table: 'VIP 1',
      items: [
        { name: 'Smoked Truffle Tagliolini', qty: 2, notes: 'Extra shaved parmesan' },
        { name: 'Midnight Espresso Martini', qty: 2 },
        { name: 'Dark Chocolate Lava Fondant', qty: 1 }
      ],
      total: 3820,
      payment: 'Card Machine (POS)',
      timeAgo: '4m ago',
      status: 'preparing'
    },
    {
      id: '#MDN-7412',
      table: '2',
      items: [
        { name: 'Wood-Fired Truffle & Burrata Pizza', qty: 1 },
        { name: 'Classic Cuban Mojito', qty: 2, notes: 'Less ice' }
      ],
      total: 2190,
      payment: 'Instant UPI',
      timeAgo: '9m ago',
      status: 'ready'
    },
    {
      id: '#MDN-6184',
      table: 'Balcony A',
      items: [
        { name: 'Black Angus Wagyu Burger', qty: 2, notes: 'Medium rare, extra truffle mayo' },
        { name: 'Smoked Bourbon Old Fashioned', qty: 2 }
      ],
      total: 3450,
      payment: 'Pay at Table',
      timeAgo: '12m ago',
      status: 'preparing'
    }
  ];

  // Merge real customer orders from this session with the kitchen tickets
  const [tickets, setTickets] = useState<KitchenTicket[]>(() => {
    const liveFromSession: KitchenTicket[] = sessionOrders.map((ord) => ({
      id: ord.id,
      table: ord.table,
      items: ord.items.map((ci) => ({
        name: ci.item.name,
        qty: ci.qty,
        notes: ci.instruction || undefined,
      })),
      total: ord.total,
      payment: ord.paymentMethod === 'upi' ? 'UPI' : ord.paymentMethod === 'card' ? 'Card' : 'Pay at Table',
      timeAgo: 'Just now',
      status: ord.status || 'received',
    }));

    return [...liveFromSession, ...initialSimulatedTickets];
  });

  const handleAdvanceStatus = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const nextStatus: Record<KitchenTicket['status'], KitchenTicket['status']> = {
            received: 'preparing',
            preparing: 'ready',
            ready: 'served',
            served: 'served',
          };
          return { ...t, status: nextStatus[t.status] };
        }
        return t;
      })
    );
  };

  const handleSimulateAlert = (type: 'Waiter' | 'Bill') => {
    if (onAddTestAlert) {
      const sampleTables = ['3', 'VIP 2', '4', 'Balcony B'];
      const randomTable = sampleTables[Math.floor(Math.random() * sampleTables.length)];
      const sampleNotes = type === 'Waiter' 
        ? ['Extra ice & glasses', 'Check on cocktail delay', 'Clean cutlery'] 
        : ['Split bill across 3 cards', 'UPI QR required', 'Cash payment'];
      const randomNote = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
      onAddTestAlert(type, randomTable, randomNote);
    }
  };

  // Base daily revenue + session total
  const baseRevenue = 48650;
  const totalRevenue = baseRevenue + sessionTotal;
  const totalOrdersCount = tickets.length + 18;
  const aov = Math.round(totalRevenue / totalOrdersCount);

  return (
    <div className="animate-fade-in text-left space-y-6 pb-12">
      {/* TOP CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            id="admin-back-btn"
            type="button"
            onClick={onBackToRestaurant}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1e1e1e] hover:bg-[#282828] border border-[#383838] hover:border-[#d4af37] text-white hover:text-[#d4af37] text-xs font-bold transition active:scale-95 cursor-pointer shadow-sm group"
            title="Return to Customer Menu"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Restaurant</span>
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white font-serif tracking-wider">
                OWNER CONTROL PANEL
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 uppercase tracking-wider">
                <Sparkles className="w-2.5 h-2.5" /> Secret Admin
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Real-time floor dispatch, live KDS queue, and daily revenue telemetry.
            </p>
          </div>
        </div>

        {/* Quick Simulator & Audio Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
              soundEnabled
                ? 'bg-[#181818] border-[#333] text-zinc-300 hover:text-white'
                : 'bg-[#221515] border-rose-900/50 text-rose-400'
            }`}
            title={soundEnabled ? 'Chime sound active' : 'Sound muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#d4af37]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleSimulateAlert('Waiter')}
            className="px-2.5 py-1.5 rounded-xl bg-[#1a1811] hover:bg-[#242013] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Simulate incoming waiter call"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Test Alert</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-[#242424] pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]'
          }`}
        >
          <span>All Modules</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Staff Alerts ({staffAlerts.length})</span>
          {staffAlerts.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kitchen')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'kitchen'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Kitchen Tickets ({tickets.filter(t => t.status !== 'served').length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-[#d4af37] text-black shadow-md'
              : 'bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Today's Analytics</span>
        </button>
      </div>

      {/* SECTION 3: REVENUE & EXECUTIVE ANALYTICS METRICS */}
      {(activeTab === 'all' || activeTab === 'analytics') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#d4af37]" />
              Executive Financials & Shift Performance
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Today • Evening Service</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Card 1: Today's Revenue */}
            <div className="bg-gradient-to-br from-[#181611] to-[#121212] border border-[#d4af37]/40 rounded-2xl p-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37] block">
                Today's Gross Sales
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-serif mt-1">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 inline" /> +19.4% vs last Tuesday
              </div>
            </div>

            {/* Card 2: Active Floor Tables */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Active Tables
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
                7 / 10 <span className="text-xs text-zinc-500 font-sans font-normal">(70% Occ.)</span>
              </div>
              <div className="text-[11px] text-[#d4af37] font-medium mt-1">
                VIP 1, VIP 2, T-2, T-5 occupied
              </div>
            </div>

            {/* Card 3: Total Orders */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Total Orders Placed
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
                {totalOrdersCount} Tickets
              </div>
              <div className="text-[11px] text-zinc-400 font-medium mt-1">
                Kitchen Avg Prep: ~11 mins
              </div>
            </div>

            {/* Card 4: Average Order Value */}
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Average Spend / Table (AOV)
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-serif mt-1">
                ₹{aov.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">
                +₹420 lift via AI Pairings
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 1: LIVE STAFF ALERTS */}
      {(activeTab === 'all' || activeTab === 'alerts') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#d4af37]" />
                Live Staff Alerts & Floor Requests
              </h3>
              {staffAlerts.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                  {staffAlerts.length} Action Needed
                </span>
              )}
            </div>

            {staffAlerts.length > 0 && (
              <button
                type="button"
                onClick={onClearAllAlerts}
                className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Alerts</span>
              </button>
            )}
          </div>

          {staffAlerts.length === 0 ? (
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">All Tables Attended</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No active waiter calls or bill checkout requests pending from diners.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleSimulateAlert('Bill')}
                  className="text-xs text-[#d4af37] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Simulate Customer Request
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {staffAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-2xl p-4 border transition shadow-lg relative overflow-hidden flex flex-col justify-between ${
                    alert.type === 'Bill'
                      ? 'bg-[#141814] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-[#1a1711] border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-[#333] text-xs font-extrabold text-white font-mono">
                          Table {alert.tableNo}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            alert.type === 'Bill'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30'
                          }`}
                        >
                          {alert.type === 'Bill' ? <Receipt className="w-3 h-3" /> : <Bell className="w-3 h-3" />}
                          {alert.type === 'Bill' ? 'Bill & Folio' : 'Call Waiter'}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {alert.time}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 font-medium mb-3">
                      {alert.note ? (
                        <>
                          <span className="text-zinc-500">Request:</span> <strong className="text-white">"{alert.note}"</strong>
                        </>
                      ) : (
                        `Diner at Table ${alert.tableNo} requested immediate assistance.`
                      )}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Resolve & Clear</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: ACTIVE KITCHEN DISPLAY SYSTEM (KDS) */}
      {(activeTab === 'all' || activeTab === 'kitchen') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-[#d4af37]" />
              Active Kitchen Display (KDS Live Queue)
            </h3>
            <span className="text-[11px] text-zinc-400">
              {tickets.filter((t) => t.status !== 'served').length} Active Tickets in Kitchen
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tickets.map((ticket) => {
              const statusColors: Record<KitchenTicket['status'], string> = {
                received: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                preparing: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                ready: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                served: 'bg-zinc-800 text-zinc-400 border-zinc-700',
              };

              const nextStatusLabel: Record<KitchenTicket['status'], string | null> = {
                received: 'Start Prepping →',
                preparing: 'Mark Ready →',
                ready: 'Mark Served ✓',
                served: null,
              };

              return (
                <div
                  key={ticket.id}
                  className={`bg-[#141414] border rounded-2xl p-4 flex flex-col justify-between transition shadow-md ${
                    ticket.status === 'ready'
                      ? 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : ticket.status === 'served'
                      ? 'border-[#222] opacity-70'
                      : 'border-[#292929]'
                  }`}
                >
                  <div>
                    {/* Ticket Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-[#242424] pb-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md bg-[#1f1f1f] text-white font-mono font-bold text-xs border border-[#333]">
                          Table {ticket.table}
                        </span>
                        <span className="text-xs font-mono font-semibold text-zinc-400">
                          {ticket.id}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          statusColors[ticket.status]
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    {/* Ticket Items */}
                    <div className="space-y-2 mb-4 font-mono text-xs">
                      {ticket.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col">
                          <div className="flex items-center justify-between text-zinc-200">
                            <span className="font-semibold">
                              {item.qty}x {item.name}
                            </span>
                          </div>
                          {item.notes && (
                            <span className="text-[11px] text-[#d4af37] italic pl-3 border-l border-[#d4af37]/40 mt-0.5 font-sans">
                              "{item.notes}"
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ticket Footer & Actions */}
                  <div className="pt-3 border-t border-[#242424] flex items-center justify-between gap-2">
                    <div className="text-[11px] text-zinc-400">
                      <span>Total: </span>
                      <strong className="text-white font-mono">₹{ticket.total}</strong>
                      <span className="text-zinc-500"> ({ticket.timeAgo})</span>
                    </div>

                    {nextStatusLabel[ticket.status] && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceStatus(ticket.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#222] hover:bg-[#2d2d2d] border border-[#383838] hover:border-[#d4af37] text-white hover:text-[#d4af37] text-xs font-bold transition active:scale-95 cursor-pointer"
                      >
                        {nextStatusLabel[ticket.status]}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
