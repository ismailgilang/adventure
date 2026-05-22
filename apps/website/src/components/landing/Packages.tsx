"use client";

import Link from "next/link";
import { ImageWithSkeleton } from "@/components/ui/Skeleton";

interface Package {
  id: string | number;
  title: string;
  slug?: string;
  category: string;
  duration: string;
  rating: string;
  reviews: string;
  price: string | null;
  image: string;
}

interface PackagesProps {
  packagesList: Package[];
}

export default function Packages({ packagesList }: PackagesProps) {
  return (
    <section id="paket" className="py-24 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 reveal">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-sm font-semibold mb-4">
            Pilihan Paket Terbaik
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Paket Wisata <span className="gradient-text">Eksklusif</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packagesList.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-gray-100/50 card-hover reveal"
            >
              <Link href={`/paket/${p.slug || p.id}`} className="block relative h-64 overflow-hidden bg-gray-100">
                <ImageWithSkeleton
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  containerClassName="w-full h-full"
                />
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

        <div className="mt-16 text-center reveal">
          <Link
            href="/paket"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all transform hover:scale-105"
          >
            <span>Lihat Semua Paket Wisata</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
