"use client";

import Link from "next/link";

interface MobileMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

export default function MobileMenu({ menuOpen, toggleMenu }: MobileMenuProps) {
  return (
    <>
      <div
        id="mobileMenu"
        className={`mobile-menu fixed top-0 right-0 h-full w-72 bg-white z-50 p-6 shadow-2xl flex flex-col ${menuOpen ? "open" : ""}`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center font-black text-xl text-white">
              V
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-base font-black tracking-tighter text-gray-900 uppercase">Villa</span>
              <span className="text-[9px] font-extrabold tracking-[0.1em] text-accent-700 uppercase">Situ Cileunca</span>
            </div>
          </div>
          <button
            onClick={toggleMenu}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <Link href="/" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Beranda</Link>
          <Link href="/paket" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Paket Wisata</Link>
          <Link href="/kalender" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Kalender</Link>
          <Link href="/galeri" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Galeri</Link>
          <Link href="/blog" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Blog</Link>
          <hr className="border-gray-200 my-2" />
          <Link
            href="/pesan"
            onClick={toggleMenu}
            className="mt-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-center text-sm font-semibold text-white shadow-lg shadow-primary-500/20"
          >
            Pesan Sekarang
          </Link>
        </div>
        
        <div className="mt-auto pb-6 text-center">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">© 2026 Villa Situ Cileunca</p>
        </div>
      </div>
      {menuOpen && (
        <div id="menuOverlay" className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all" onClick={toggleMenu}></div>
      )}
    </>
  );
}
