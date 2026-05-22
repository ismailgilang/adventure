"use client";

import Link from "next/link";
import { MutableRefObject, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface HeroProps {
  hero: any;
  countersRef: MutableRefObject<HTMLSpanElement[]>;
}

export default function Hero({ hero, countersRef }: HeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-gray-900">
      {/* Background Image with Overlay and Skeleton */}
      <div className="absolute inset-0 z-0">
        {!imageLoaded && <Skeleton className="absolute inset-0 w-full h-full bg-gray-800" />}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${hero.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png"})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <img 
            src={hero.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png"} 
            alt="Hero Background" 
            className="hidden" 
            onLoad={() => setImageLoaded(true)} 
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8 reveal active">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-semibold mb-4 backdrop-blur-md">
            Jelajahi Surga Nusantara
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xl">
            {hero.title}
          </h1>
          <p className="text-gray-100 text-lg sm:text-xl max-w-2xl mx-auto drop-shadow-md">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/pesan"
              className="px-10 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-white font-bold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35 transition-all transform hover:scale-105 text-center"
            >
              {hero.buttonText || "Pesan Sekarang"}
            </Link>
            <a
              href="#paket"
              className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-all text-center"
            >
              Lihat Destinasi
            </a>
          </div>
          
          {/* Stats Counter Grid */}
          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/10 mt-12">
            <div>
              <span
                ref={(el) => { if (el) countersRef.current[0] = el; }}
                data-target="15"
                className="block text-3xl sm:text-4xl font-extrabold text-white"
              >
                0+
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destinasi</span>
            </div>
            <div>
              <span
                ref={(el) => { if (el) countersRef.current[1] = el; }}
                data-target="10000"
                className="block text-3xl sm:text-4xl font-extrabold text-white"
              >
                0+
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wisatawan</span>
            </div>
            <div>
              <span
                ref={(el) => { if (el) countersRef.current[2] = el; }}
                data-target="98"
                className="block text-3xl sm:text-4xl font-extrabold text-white"
              >
                0%
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kepuasan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
