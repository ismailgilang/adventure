"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";

interface PackagesClientProps {
  packages: any[];
  seo: any;
  company: any;
}

export default function PackagesClient({
  packages,
  seo,
  company,
}: PackagesClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"wisata" | "villa">("wisata");
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const packagesList = packages
    .filter((pkg) => pkg.category === filterCategory)
    .map((pkg) => ({
      id: pkg.id,
      title: pkg.name,
      slug: pkg.slug,
      duration: pkg.duration,
      price: pkg.price > 0 ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(pkg.price) : null,
      image: pkg.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png",
    }));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar navScrolled={true} seo={seo} company={company} toggleMenu={toggleMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Header */}
      <header className="pt-32 pb-16 bg-white relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.05),transparent,transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-sm font-semibold mb-4">Eksplorasi Nusantara</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Pilihan <span className="gradient-text">Paket {filterCategory === "wisata" ? "Wisata" : "Villa"}</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Temukan berbagai destinasi eksotis dan pengalaman tak terlupakan yang telah kami rancang khusus untuk petualangan impian Anda.
          </p>
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setFilterCategory("wisata")}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                filterCategory === "wisata"
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
              }`}
            >
              Wisata
            </button>
            <button
              onClick={() => setFilterCategory("villa")}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                filterCategory === "villa"
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"
              }`}
            >
              Villa
            </button>
          </div>
        </div>
      </header>

      {/* Packages Grid */}
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {packagesList.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Belum ada paket {filterCategory} tersedia.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packagesList.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-gray-100/50 card-hover reveal active"
              >
                <Link href={`/paket/${p.slug || p.id}`} className="block relative h-64 overflow-hidden bg-gray-100">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                </Link>
                <div className="p-8">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                    {p.duration}
                  </span>
                  <Link href={`/paket/${p.slug || p.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 hover:text-primary-600 transition-colors line-clamp-1">{p.title}</h3>
                  </Link>
                  
                  <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      {p.price ? (
                        <div>
                          <span className="text-gray-400 text-[10px] uppercase font-bold block">Mulai dari</span>
                          <span className="text-lg font-extrabold text-primary-600">{p.price}</span>
                        </div>
                      ) : (
                        <div className="h-10"></div>
                      )}
                      <Link
                        href={`/paket/${p.slug || p.id}`}
                        className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full text-xs font-bold hover:bg-primary-100 hover:text-primary-600 transition-colors"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                    <Link
                      href="/pesan"
                      className="w-full py-3 bg-gray-900 text-white text-center rounded-2xl text-sm font-semibold hover:bg-primary-600 transition-colors"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </main>

      <Footer seo={seo} cta={{}} company={company} packages={packages} />
    </div>
  );
}
