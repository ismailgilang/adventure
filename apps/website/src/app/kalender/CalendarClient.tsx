"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface CalendarClientProps {
  seo: any;
  company: any;
}

export default function CalendarClient({ seo, company }: CalendarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date());

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setBookedDates(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const bookedDateObjects = bookedDates.map((dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  });

  const disabledDays = [
    { before: new Date(new Date().setHours(0, 0, 0, 0)) },
    ...bookedDateObjects,
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar navScrolled={true} seo={seo} company={company} toggleMenu={toggleMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-gray-600 text-sm font-semibold">Live · Jadwal Ketersediaan</span>
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
              Kalender <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">Reservasi</span>
            </h1>
            <p className="text-gray-500 text-base">
              Tanggal <span className="font-bold text-red-500 line-through">dicoret</span> = sudah dipesan. Pilih hari yang masih tersedia.
            </p>
          </div>

          {/* Legend Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-sm font-semibold text-gray-700">
              <span className="w-3 h-3 rounded-full bg-green-400"></span> Tersedia
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-sm font-semibold text-red-600">
              <span className="w-3 h-3 rounded-full bg-red-400"></span> Sudah Dipesan
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Orange Gradient Header */}
            <div
              className="px-8 py-6 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #C96A2E 0%, #E8922A 40%, #F0C64A 100%)" }}
            >
              <div className="text-white">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-orange-100 mb-0.5">Kalender Reservasi</p>
                <h2 className="text-3xl font-black tracking-tight">{format(month, "MMMM yyyy", { locale: id })}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { const p = new Date(month); p.setMonth(p.getMonth() - 1); setMonth(p); }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => { const n = new Date(month); n.setMonth(n.getMonth() + 1); setMonth(n); }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin"></div>
                  <p className="text-sm text-gray-400 font-medium">Memuat jadwal...</p>
                </div>
              ) : (
                <>
                  <style>{`
                    .full-cal-wrap {
                      width: 100%;
                    }
                    .full-cal-wrap .rdp-root {
                      width: 100%;
                      margin: 0;
                    }
                    .full-cal-wrap .rdp-month_caption {
                      display: none;
                    }
                    .full-cal-wrap .rdp-nav {
                      display: none;
                    }
                    .full-cal-wrap .rdp-months {
                      width: 100%;
                    }
                    .full-cal-wrap .rdp-month {
                      width: 100%;
                    }
                    .full-cal-wrap .rdp-month_grid {
                      width: 100%;
                      table-layout: fixed;
                      border-collapse: separate;
                      border-spacing: 0 4px;
                    }
                    .full-cal-wrap .rdp-weekdays {
                      width: 100%;
                    }
                    .full-cal-wrap .rdp-weekday {
                      width: calc(100% / 7);
                      text-align: center;
                      font-size: 0.7rem;
                      font-weight: 800;
                      text-transform: uppercase;
                      letter-spacing: 0.1em;
                      color: #9ca3af;
                      padding: 6px 0 14px;
                    }
                    .full-cal-wrap .rdp-week {
                      width: 100%;
                    }
                    .full-cal-wrap .rdp-day {
                      width: calc(100% / 7);
                      text-align: center;
                      padding: 2px;
                    }
                    .full-cal-wrap .rdp-day button {
                      width: 100%;
                      height: auto !important;
                      aspect-ratio: 1 / 1 !important;
                      padding: 0;
                      border-radius: 12px;
                      font-size: clamp(0.9rem, 2vw, 1.25rem);
                      font-weight: 600;
                      color: #1e293b;
                      transition: all 0.15s ease;
                      margin: 0 auto;
                    }
                    .full-cal-wrap .rdp-day button:hover:not([disabled]) {
                      background: #fff7ed;
                      color: #c96a2e;
                      transform: scale(1.06);
                      box-shadow: 0 4px 12px rgba(201,106,46,0.15);
                    }
                    .full-cal-wrap .rdp-day_today:not(.rdp-day_outside) button {
                      font-weight: 900;
                      color: #c96a2e;
                      border: 2.5px solid #fed7aa;
                      background: #fff7ed;
                    }
                    .full-cal-wrap .is-booked button {
                      text-decoration: line-through;
                      color: #ef4444 !important;
                      background: #fef2f2 !important;
                      font-weight: 700;
                      cursor: not-allowed;
                    }
                    .full-cal-wrap .rdp-day_outside button {
                      color: #d1d5db !important;
                      background: transparent !important;
                    }
                    .full-cal-wrap .rdp-day_selected button {
                      background: linear-gradient(135deg, #C96A2E, #F0C64A) !important;
                      color: white !important;
                      font-weight: 800;
                      box-shadow: 0 6px 16px rgba(201,106,46,0.35);
                    }
                    /* For past dates that are disabled but not booked */
                    .full-cal-wrap .rdp-day button:disabled:not(.is-booked) {
                      cursor: not-allowed;
                    }
                  `}</style>
                  <div className="full-cal-wrap">
                    <DayPicker
                      mode="single"
                      locale={id}
                      month={month}
                      onMonthChange={setMonth}
                      disabled={disabledDays}
                      modifiers={{ booked: bookedDateObjects }}
                      modifiersClassNames={{ booked: 'is-booked' }}
                      showOutsideDays
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-10 text-center">
            <Link
              href="/pesan"
              className="inline-flex items-center gap-2 px-10 py-4 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              style={{ background: "linear-gradient(135deg, #C96A2E, #F0C64A)" }}
            >
              Pesan Sekarang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {seo?.logoUrl ? (
              <img src={seo.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black" style={{ background: "linear-gradient(135deg, #C96A2E, #F0C64A)" }}>V</div>
            )}
            <span className="text-sm font-bold text-gray-900">{company?.name || "Villa Situ Cileunca"}</span>
          </div>
          <p className="text-gray-400 text-xs">© {new Date().getFullYear()} {company?.name || "Villa Situ Cileunca"}.</p>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-400 hover:text-primary-600 text-xs transition-colors">Beranda</Link>
            <Link href="/paket" className="text-gray-400 hover:text-primary-600 text-xs transition-colors">Paket</Link>
            <Link href="/pesan" className="text-gray-400 hover:text-primary-600 text-xs transition-colors">Pesan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
