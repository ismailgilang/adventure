"use client";

import { ImageWithSkeleton } from "@/components/ui/Skeleton";

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  instagramUrl?: string;
}

interface TeamProps {
  team: TeamMember[];
}

export default function Team({ team }: TeamProps) {
  return (
    <section id="tim" className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 reveal">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-100 border border-accent-200 text-accent-700 text-sm font-semibold mb-4">
            Tim Profesional
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Orang di Balik <span className="gradient-text">Layar Kami</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((m, i) => (
            <div key={i} className="bg-gray-50 rounded-3xl p-6 text-center card-hover reveal shadow-lg border border-gray-100/50 flex flex-col justify-between items-center">
              <div>
                <ImageWithSkeleton
                  src={m.imageUrl || "/team/default.jpg"}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  containerClassName="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-500/20 group bg-gray-100"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{m.name}</h3>
                <p className="text-primary-600 text-xs font-semibold uppercase tracking-wider mb-4">{m.role}</p>
              </div>
              {m.instagramUrl && (
                <a
                  href={m.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Instagram</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
