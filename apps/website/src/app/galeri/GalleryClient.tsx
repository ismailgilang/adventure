"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";
import { ImageWithSkeleton } from "@/components/ui/Skeleton";

interface GalleryClientProps {
  galleryItems: any[];
  seo: any;
  company: any;
}

export default function GalleryClient({
  galleryItems,
  seo,
  company,
}: GalleryClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const categories = [
    { label: "Semua", value: "ALL" },
    { label: "Wisata", value: "TOUR" },
    { label: "Tim Kami", value: "TEAM" },
    { label: "Umum", value: "GENERAL" },
  ];

  const filteredItems = filter === "ALL" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar navScrolled={true} seo={seo} company={company} toggleMenu={toggleMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Header */}
      <header className="pt-32 pb-16 bg-white relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent,transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-4">Momen Berharga</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Galeri <span className="gradient-text">Petualangan</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Kumpulan potret keindahan alam dan momen keseruan perjalanan yang telah kami lalui bersama para penjelajah Nusantara.
          </p>
        </div>
      </header>

      {/* Gallery Filter & Grid */}
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                  filter === cat.value
                    ? "bg-gray-900 text-white shadow-lg scale-105"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-primary-500 hover:text-primary-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-3xl overflow-hidden shadow-xl border border-gray-100 break-inside-avoid reveal active"
              >
                <ImageWithSkeleton
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 z-20">
                  <span className="text-primary-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                    {item.category === 'TOUR' ? 'Destinasi' : item.category === 'TEAM' ? 'Tim Kami' : 'Umum'}
                  </span>
                  <h3 className="text-white text-xl font-bold">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Belum Ada Foto</h3>
              <p className="text-gray-500">Foto untuk kategori ini akan segera kami tambahkan.</p>
            </div>
          )}
        </div>
      </main>

      <Footer seo={seo} cta={{}} company={company} />
    </div>
  );
}
