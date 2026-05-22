"use client";

import Link from "next/link";
import { ImageWithSkeleton } from "@/components/ui/Skeleton";

interface AboutProps {
  about: any;
}

export default function About({ about }: AboutProps) {
  return (
    <section id="tentang" className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-6 relative reveal">
          <ImageWithSkeleton
            src={about.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1c53a6f25-d82a-4c9b-a4f1-74590a7c94ac.png"}
            alt={about.title || "Tentang Kami"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            containerClassName="relative rounded-[48px] overflow-hidden shadow-2xl aspect-[4/3] group bg-gray-100"
          />
        </div>
        <div className="lg:col-span-6 space-y-6 reveal">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-100 border border-accent-200 text-accent-700 text-sm font-semibold">
            {about.title || "Tentang Kami"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
             <span className="gradient-text">{about.subtitle || "Petualangan Terpercaya Anda"}</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed whitespace-pre-line">
            {about.description}
          </p>
          <div className="pt-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all"
            >
              <span>Pelajari Program Konservasi Kami</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
