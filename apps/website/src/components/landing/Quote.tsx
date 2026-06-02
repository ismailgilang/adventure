"use client";

interface QuoteProps {
  quotes: any;
}

export default function Quote({ quotes }: QuoteProps) {
  if (!quotes?.title) return null;

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-r from-accent-50 via-white to-accent-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
        <div className="relative">
          <svg className="w-10 h-10 mx-auto mb-6 text-accent-300/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-relaxed italic">
            &ldquo;{quotes.title}&rdquo;
          </blockquote>
          <p className="mt-6 text-sm text-gray-400 font-semibold uppercase tracking-widest">
            — Kata Hari Ini —
          </p>
        </div>
      </div>
    </section>
  );
}
