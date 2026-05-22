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
        className={`mobile-menu fixed top-0 right-0 h-full w-72 bg-white z-50 p-6 shadow-2xl ${menuOpen ? "open" : ""}`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mt-16 flex flex-col gap-4">
          <Link href="/" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Beranda</Link>
          <Link href="/paket" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Paket Wisata</Link>
          <Link href="/galeri" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Galeri</Link>
          <Link href="/blog" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Blog</Link>
          <hr className="border-gray-200 my-2" />
          <Link
            href="/pesan"
            onClick={toggleMenu}
            className="mt-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-center text-sm font-semibold text-white"
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>
      {menuOpen && (
        <div id="menuOverlay" className="fixed inset-0 bg-black/30 z-40" onClick={toggleMenu}></div>
      )}
    </>
  );
}
