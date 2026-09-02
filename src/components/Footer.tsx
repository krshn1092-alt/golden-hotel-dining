import React from 'react';
import {
  UtensilsCrossed,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Sparkles,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-16 bg-gradient-to-b from-[#111111] via-[#0d0d0d] to-[#080808] border-t border-[#d4af37]/20 text-zinc-400 text-xs pb-32 sm:pb-28 pt-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Top Accent Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent"></div>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8a7222] p-[1px] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <div className="w-full h-full bg-[#121212] rounded-[11px] flex items-center justify-center text-[#d4af37]">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-wider text-white uppercase font-serif">
                  THE MIDNIGHT
                </h3>
                <p className="text-[11px] text-[#d4af37] font-medium tracking-wide">
                  Fine Dining & Cocktail Bar
                </p>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              Experience the pinnacle of luxury dining and craft cocktails in the heart of the city. Handcrafted culinary masterpieces curated with passion.
            </p>

            {/* Social & Partner Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                id="footer-instagram-link"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181818] border border-[#2b2b2b] hover:border-[#d4af37] text-zinc-300 hover:text-[#d4af37] transition group active:scale-95"
                title="Follow on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-[#d4af37] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium">Instagram</span>
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                id="footer-facebook-link"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181818] border border-[#2b2b2b] hover:border-[#d4af37] text-zinc-300 hover:text-[#d4af37] transition group active:scale-95"
                title="Follow on Facebook"
              >
                <Facebook className="w-3.5 h-3.5 text-[#d4af37] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium">Facebook</span>
              </a>

              <a
                href="https://zomato.com"
                target="_blank"
                rel="noreferrer"
                id="footer-zomato-link"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#e23744]/10 border border-[#e23744]/30 hover:border-[#e23744] text-red-400 hover:text-red-300 text-[11px] font-semibold transition active:scale-95"
                title="View on Zomato"
              >
                <span>Zomato</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://swiggy.com"
                target="_blank"
                rel="noreferrer"
                id="footer-swiggy-link"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#fc8019]/10 border border-[#fc8019]/30 hover:border-[#fc8019] text-orange-400 hover:text-orange-300 text-[11px] font-semibold transition active:scale-95"
                title="Order on Swiggy"
              >
                <span>Swiggy</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Contact & Location */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Contact & Location
            </h4>

            <div className="space-y-2.5 text-zinc-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  123 VIP Road, Luxury Enclave, Kanpur, UP
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a
                  href="tel:+918840663958"
                  id="footer-phone-link"
                  className="hover:text-[#d4af37] transition font-medium text-white"
                >
                  +91 8840663958
                </a>
                <span className="text-[10px] text-zinc-500">(Reservations & Queries)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a
                  href="mailto:reservations@themidnight.demo"
                  id="footer-email-link"
                  className="hover:text-[#d4af37] transition text-zinc-300"
                >
                  reservations@themidnight.demo
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Hours & Etiquette */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Opening Hours & Ambience
            </h4>

            <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] space-y-2">
              <div className="flex items-center justify-between text-zinc-200 font-medium">
                <span className="text-white font-semibold">Everyday</span>
                <span className="text-[#d4af37] font-bold">6:00 PM – 2:00 AM</span>
              </div>
              <div className="h-[1px] bg-[#222] w-full" />
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>Smart Casual dress code applies.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Divider & Copyright */}
        <div className="pt-6 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] text-zinc-500">
            © 2026 The Midnight. System Engineered by Krishna.
          </p>
          <div className="flex items-center gap-3 text-[11px] text-zinc-500">
            <span>Dine-In Digital Concierge</span>
            <span>•</span>
            <span className="text-[#d4af37]">High Spirits & Fine Gastronomy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
