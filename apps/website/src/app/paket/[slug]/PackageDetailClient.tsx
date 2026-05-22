"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";
import { ImageWithSkeleton } from "@/components/ui/Skeleton";

interface PackageData {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
  priceFormatted: string;
}

interface PackageDetailClientProps {
  pkg: any;
  seo: any;
  company?: any;
  recommended: any[];
}

export default function PackageDetailClient({ pkg, seo, company, recommended }: PackageDetailClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  if (!pkg) return null;

  const priceFormatted = pkg.price > 0 ? new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(pkg.price) : null;

  const waNumber = company?.whatsapp ? company.whatsapp.replace(/[^0-9]/g, "") : "628123456789";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar navScrolled={true} seo={seo} company={company} toggleMenu={toggleMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link href="/paket" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-8 transition-colors group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            <span>Kembali ke Semua Paket</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Content */}
            <div className="lg:col-span-7 space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                  <span>{pkg.duration}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                  {pkg.name}
                </h1>
              </div>

              {/* Cover Image */}
              <div className="rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 bg-gray-100">
                <ImageWithSkeleton
                  src={pkg.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png"}
                  alt={pkg.name}
                  className="w-full h-auto object-contain"
                  containerClassName="w-full h-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-primary-600 pl-4">Deskripsi Paket</h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                  {pkg.description || "Belum ada deskripsi untuk paket ini."}
                </div>
              </div>
            </div>

            {/* Right: Booking Summary / CTA */}
            <div className="lg:col-span-5">
              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl sticky top-28 space-y-8">
                {priceFormatted && (
                  <div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">Harga Paket</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-primary-600">{priceFormatted}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Syarat & Ketentuan:</h3>

                  <ul className="space-y-3">
                    {[
                      "Check-in mulai pukul 14:00 WIB",
                      "Check-out maksimal pukul 12:00 WIB",
                      "DP minimal 50% untuk konfirmasi booking",
                      "Pembatalan H-3 tidak dapat refund",
                      "Menjaga kebersihan dan fasilitas villa",
                      "Dilarang membawa barang berbahaya atau terlarang"
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <svg
                          className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                          />
                        </svg>

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link 
                  href="/pesan"
                  className="block w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center font-bold rounded-2xl hover:shadow-xl hover:shadow-primary-500/25 transition-all transform hover:scale-[1.02]"
                >
                  Pesan Sekarang
                </Link>

                <div className="pt-6 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Butuh bantuan atau kustomisasi paket? <br/>
                    <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-bold hover:underline">Hubungi kami via WhatsApp</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Section */}
          {recommended.length > 0 && (
            <div className="pt-24 mt-16 border-t border-gray-200">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="text-primary-600 font-bold text-sm uppercase tracking-widest block mb-2">Eksplorasi Lainnya</span>
                  <h2 className="text-3xl font-black text-gray-900">Paket Wisata Rekomendasi</h2>
                </div>
                <Link href="/paket" className="text-sm font-bold text-gray-400 hover:text-primary-600 transition-colors">Lihat Semua →</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommended.map((item: any) => (
                  <div key={item.id} className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-gray-100/50 card-hover flex flex-col">
                    <Link href={`/paket/${item.slug}`} className="block relative h-48 overflow-hidden bg-gray-100">
                      <ImageWithSkeleton
                        src={item.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png"}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        containerClassName="w-full h-full"
                      />
                    </Link>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">{item.duration}</span>
                        <Link href={`/paket/${item.slug}`}>
                          <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{item.name}</h4>
                        </Link>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        {item.price > 0 ? (
                          <span className="text-primary-600 font-black">
                            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.price)}
                          </span>
                        ) : (
                          <span></span>
                        )}
                        <Link href={`/paket/${item.slug}`} className="text-xs font-bold text-gray-900 hover:text-primary-600 transition-colors">Detail →</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer seo={seo} cta={{}} company={company} />
    </div>
  );
}
