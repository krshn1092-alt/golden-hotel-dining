import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from './data/menu';
import { MenuItem, CartItem, ViewType, PaymentMethod, OrderRecord, StaffAlert } from './types';
import { Header } from './components/Header';
import { MenuView } from './components/MenuView';
import { CartView } from './components/CartView';
import { OrderPlacedView } from './components/OrderPlacedView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { FloatingCartBar } from './components/FloatingCartBar';
import { QuickActions } from './components/QuickActions';
import { WaiterModal } from './components/WaiterModal';
import { BillModal } from './components/BillModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { Footer } from './components/Footer';
import { Bell, Receipt, CheckCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [seatNumber, setSeatNumber] = useState<string>("5");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<ViewType>('menu');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('table');
  const [lastOrder, setLastOrder] = useState<OrderRecord | null>(null);
  const [sessionOrders, setSessionOrders] = useState<OrderRecord[]>([]);
  const [orderCompletionTime, setOrderCompletionTime] = useState<number | null>(null);
  const [sessionTotal, setSessionTotal] = useState<number>(0);

  // Global Staff Alerts State
  const [staffAlerts, setStaffAlerts] = useState<StaffAlert[]>([
    {
      id: 'alert-init-1',
      tableNo: '3',
      type: 'Waiter',
      time: '3m ago',
      note: 'Water & extra wine glasses',
      timestamp: Date.now() - 180000,
    },
    {
      id: 'alert-init-2',
      tableNo: 'VIP 2',
      type: 'Bill',
      time: '1m ago',
      note: 'Card Machine (POS) requested',
      timestamp: Date.now() - 60000,
    }
  ]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'waiter' | 'bill' | 'admin' } | null>(null);

  const showToast = (title: string, desc: string, type: 'waiter' | 'bill' | 'admin' = 'waiter') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Modals state
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);

  // Read seat number from URL query parameters (e.g. ?seat=5 or ?table=12)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const seat = params.get('seat') || params.get('table');
      if (seat) {
        setSeatNumber(seat);
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleAddStaffAlert = (type: 'Waiter' | 'Bill', tableNo: string, note?: string) => {
    const newAlert: StaffAlert = {
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tableNo,
      type,
      time: 'Just now',
      note,
      timestamp: Date.now(),
    };
    setStaffAlerts((prev) => [newAlert, ...prev]);

    if (type === 'Waiter') {
      showToast(
        'Staff Alert Dispatched',
        `Floor captain notified for Table ${tableNo}${note ? `: "${note}"` : '.'}`,
        'waiter'
      );
    } else {
      showToast(
        'Bill Request Received',
        `Printed check & payment folio is on the way to Table ${tableNo}.`,
        'bill'
      );
    }
  };

  const handleResolveAlert = (id: string) => {
    setStaffAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAllAlerts = () => {
    setStaffAlerts([]);
  };

  const handleAddToCart = (item: MenuItem, qty: number = 1, instruction: string = '') => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((c) => c.item.id === item.id);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].qty += qty;
        if (instruction) {
          updated[existingIdx].instruction = instruction;
        }
        return updated;
      }
      return [...prevCart, { item, qty, instruction }];
    });
  };

  const handleUpdateQty = (itemId: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((c) => {
          if (c.item.id === itemId) {
            const newQty = c.qty + delta;
            return newQty > 0 ? { ...c, qty: newQty } : null;
          }
          return c;
        })
        .filter((c): c is CartItem => c !== null);
    });
  };

  const handleRemoveItem = (itemId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.item.id !== itemId));
  };

  const handleUpdateInstruction = (index: number, instruction: string) => {
    setCart((prevCart) => {
      const updated = [...prevCart];
      if (updated[index]) {
        updated[index].instruction = instruction;
      }
      return updated;
    });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const serviceCharge = Math.round(subtotal * 0.05);
    const total = subtotal + tax + serviceCharge;
    const orderId = `#MDN-${Math.floor(1000 + Math.random() * 9000)}`;
    const completionTime = Date.now() + 15 * 60 * 1000;

    const newOrder: OrderRecord = {
      id: orderId,
      table: seatNumber,
      items: [...cart],
      subtotal,
      tax,
      serviceCharge,
      total,
      paymentMethod,
      placedAt: new Date(),
      status: 'received',
      estimatedMinutes: 15,
      completionTimestamp: completionTime,
    };

    // Format WhatsApp Order Message
    const formatPaymentMethod = (pm: PaymentMethod) => {
      switch (pm) {
        case 'table': return 'Pay at Table';
        case 'online': return 'Online Payment Gateway';
        case 'upi': return 'UPI Payment';
        case 'card': return 'Card Machine (POS)';
        default: return pm;
      }
    };

    const itemsSummary = cart.map((ci, idx) => {
      const itemLine = `${idx + 1}. ${ci.item.name} x${ci.qty} - ₹${ci.item.price * ci.qty}`;
      const noteLine = ci.instruction?.trim() ? `   ↳ Notes: "${ci.instruction.trim()}"` : '';
      return noteLine ? `${itemLine}\n${noteLine}` : itemLine;
    }).join('\n');

    const orderMessage = `*🍽️ THE MIDNIGHT - NEW DINE-IN ORDER*\n` +
      `----------------------------------\n` +
      `*📍 Table / Seat:* Table ${seatNumber}\n` +
      `*🧾 Order ID:* ${orderId}\n` +
      `*💳 Payment Method:* ${formatPaymentMethod(paymentMethod)}\n\n` +
      `*📋 Order Items:*\n` +
      `${itemsSummary}\n\n` +
      `----------------------------------\n` +
      `*Subtotal:* ₹${subtotal}\n` +
      `*Taxes & Charges (10%):* ₹${tax + serviceCharge}\n` +
      `*💰 Total Bill Amount:* ₹${total}\n` +
      `----------------------------------\n` +
      `*Status:* Order Sent to Kitchen`;

    // Trigger WhatsApp notification
    try {
      const whatsappUrl = `https://wa.me/918840663958?text=${encodeURIComponent(orderMessage)}`;
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error('Error opening WhatsApp:', err);
    }

    setLastOrder(newOrder);
    setSessionOrders((prev) => [newOrder, ...prev]);
    setOrderCompletionTime(completionTime);
    setSessionTotal((prev) => prev + total);
    setCart([]);
    setView('order_placed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090909] text-zinc-200 font-sans selection:bg-[#d4af37] selection:text-black pb-28">
      {/* TOAST NOTIFICATION CONTAINER */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-fade-in w-11/12 max-w-md pointer-events-none">
          <div
            className={`rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-md border flex items-start gap-3 pointer-events-auto ${
              toastMessage.type === 'bill'
                ? 'bg-[#111612]/95 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                : 'bg-[#181611]/95 border-[#d4af37]/50 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                toastMessage.type === 'bill'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-[#d4af37]/20 text-[#d4af37]'
              }`}
            >
              {toastMessage.type === 'bill' ? (
                <Receipt className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5 animate-bounce" />
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>{toastMessage.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </h5>
              <p className="text-[11px] sm:text-xs text-zinc-300 mt-0.5 leading-snug">
                {toastMessage.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <Header
        seatNumber={seatNumber}
        onSeatChange={(newSeat) => setSeatNumber(newSeat)}
        onLogoClick={() => setView('menu')}
        onTrackOrder={() => {
          setView('order_placed');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSecretAdmin={() => {
          setView('admin');
          showToast('Admin Mode Unlocked', 'Switched to Owner Terminal & Staff Dispatch.', 'admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {view === 'menu' && (
          <MenuView
            menuItems={MENU_ITEMS}
            cart={cart}
            onAddToCart={(item) => handleAddToCart(item, 1)}
            onUpdateQty={handleUpdateQty}
            onOpenDetail={(item) => setDetailItem(item)}
          />
        )}

        {view === 'cart' && (
          <CartView
            cart={cart}
            seatNumber={seatNumber}
            paymentMethod={paymentMethod}
            onSetPaymentMethod={setPaymentMethod}
            onBackToMenu={() => setView('menu')}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onUpdateInstruction={handleUpdateInstruction}
            onPlaceOrder={handlePlaceOrder}
            onAddToCart={(item) => handleAddToCart(item, 1)}
          />
        )}

        {view === 'order_placed' && (
          <OrderPlacedView
            lastOrder={lastOrder}
            orderCompletionTime={orderCompletionTime}
            seatNumber={seatNumber}
            onOrderMore={() => setView('menu')}
            onCallWaiter={() => setIsWaiterModalOpen(true)}
            onRequestBill={() => setIsBillModalOpen(true)}
          />
        )}

        {view === 'admin' && (
          <AdminDashboardView
            onBackToRestaurant={() => {
              setView('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            staffAlerts={staffAlerts}
            onResolveAlert={handleResolveAlert}
            onClearAllAlerts={handleClearAllAlerts}
            onAddTestAlert={handleAddStaffAlert}
            sessionOrders={sessionOrders}
            sessionTotal={sessionTotal}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* FLOATING CART BAR (Shown when cart has items and in menu view) */}
      {view === 'menu' && (
        <FloatingCartBar
          cart={cart}
          onViewCart={() => {
            setView('cart');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* PERSISTENT QUICK ACTIONS (Call Waiter, Request Bill & Track Order) - hidden in admin view */}
      {view !== 'admin' && (
        <QuickActions
          onCallWaiter={() => setIsWaiterModalOpen(true)}
          onRequestBill={() => setIsBillModalOpen(true)}
          onTrackOrder={() => {
            setView('order_placed');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          hasItemsInCart={view === 'menu' && cart.length > 0}
        />
      )}

      {/* MODALS */}
      <WaiterModal
        isOpen={isWaiterModalOpen}
        onClose={() => setIsWaiterModalOpen(false)}
        seatNumber={seatNumber}
        onTriggerAlert={(reason, note) => {
          handleAddStaffAlert('Waiter', seatNumber, note ? `${reason} - ${note}` : reason);
        }}
      />

      <BillModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        seatNumber={seatNumber}
        cart={cart}
        placedOrdersTotal={sessionTotal}
        onTriggerBillAlert={(payMode, tipAmount) => {
          const note = tipAmount > 0 
            ? `${payMode} Terminal requested (+₹${tipAmount} tip included)`
            : `${payMode} Terminal / Folio requested`;
          handleAddStaffAlert('Bill', seatNumber, note);
        }}
      />

      <ItemDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onAddToCart={handleAddToCart}
        currentQtyInCart={
          detailItem ? cart.find((c) => c.item.id === detailItem.id)?.qty || 0 : 0
        }
      />
    </div>
  );
}
