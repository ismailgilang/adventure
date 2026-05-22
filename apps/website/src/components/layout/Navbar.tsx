"use client";

import Link from "next/link";

interface NavbarProps {
  navScrolled: boolean;
  seo?: any;
  company?: any;
  toggleMenu: () => void;
}

export default function Navbar({ navScrolled, seo, company, toggleMenu }: NavbarProps) {
  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        navScrolled ? "nav-scrolled h-20" : "h-24 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="flex items-center gap-3 group">
            {seo?.logoUrl ? (
              <img src={seo.logoUrl} alt="Logo" className="h-12 w-auto object-contain transition-transform group-hover:scale-110" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center font-black text-2xl text-white group-hover:rotate-12 transition-all shadow-lg shadow-primary-500/20">
                V
              </div>
            )}
            <div className="flex flex-col -space-y-1">
              <span className={`text-xl font-black tracking-tighter transition-colors ${navScrolled ? "text-primary-600" : "text-white"}`}>
                VILLA
              </span>
              <span className={`text-[11px] font-extrabold tracking-[0.2em] transition-colors ${navScrolled ? "text-accent-600" : "text-accent-300"}`}>
                SITU CILEUNCA
              </span>
            </div>
          </Link>

          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Beranda", href: "/" },
              { label: "Paket Wisata", href: "/paket" },
              { label: "Galeri", href: "/galeri" },
              { label: "Blog", href: "/blog" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors relative group ${
                  navScrolled ? "text-gray-600 hover:text-primary-600" : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/pesan"
              className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              Pesan Sekarang
            </Link>
          </div>

          <button
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
              navScrolled ? "bg-gray-100 text-gray-700" : "bg-white/10 text-white backdrop-blur-md"
            }`}
            onClick={toggleMenu}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
