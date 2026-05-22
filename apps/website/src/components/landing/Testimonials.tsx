"use client";

import { ImageWithSkeleton } from "@/components/ui/Skeleton";

interface Testimonial {
  name: string;
  role: string;
  review: string;
  rating: number;
  imageUrl: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimoni" className="py-24 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 reveal">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-sm font-semibold mb-4">
            Testimoni Pelanggan
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Kata Mereka <span className="gradient-text">Tentang Kami</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg reveal flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {Array.from({ length: t.rating || 5 }).map((_, starIndex) => (
                    <svg key={starIndex} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed italic mb-6">"{t.review}"</p>
              </div>
              <div className="flex items-center gap-4">
                <ImageWithSkeleton
                  src={t.imageUrl || "/testi/default.jpg"}
                  alt={t.name}
                  className="w-full h-full object-cover"
                  containerClassName="w-12 h-12 rounded-full overflow-hidden bg-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <span className="text-xs text-gray-400">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
