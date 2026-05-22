"use client";

import { ImageWithSkeleton } from "@/components/ui/Skeleton";

interface CTAProps {
  cta: any;
}

export default function CTA({ cta }: CTAProps) {
  return (
    <section id="kontak" className="py-24 relative overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-[40px] overflow-hidden relative shadow-2xl">
          <ImageWithSkeleton
            src="https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/16c95331d-45f5-47ca-945b-32aa2bc0912d.png"
            alt="CTA"
            className="w-full h-96 object-cover"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/85 to-accent-800/80"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl px-8 sm:px-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">{cta.title}</h2>
              <p className="text-white/80 text-lg mb-8">{cta.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={cta.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-primary-700 rounded-full font-semibold hover:bg-gray-100 transition-all whitespace-nowrap shadow-lg inline-block text-center hover:scale-105"
                >
                  {cta.buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
