"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";

interface BlogClientProps {
  articles: any[];
  seo: any;
  company: any;
  packages?: any[];
}

export default function BlogClient({
  articles,
  seo,
  company,
  packages,
}: BlogClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const blogPosts = articles.map((art) => {
    // Hitung waktu baca berdasarkan panjang konten
    const wordCount = art.content ? art.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
    const readTime = `${Math.max(3, Math.ceil(wordCount / 200))} Menit Baca`;
    const dateFormatted = new Date(art.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    
    // Auto category mapping
    let category = "tips";
    let badge = "Tips & Trik";
    if (art.title.toLowerCase().includes("panduan") || art.title.toLowerCase().includes("raja ampat") || art.title.toLowerCase().includes("wisata")) {
      category = "destinasi";
      badge = "Panduan Wisata";
    } else if (art.title.toLowerCase().includes("budaya") || art.title.toLowerCase().includes("ubud") || art.title.toLowerCase().includes("kuliner")) {
      category = "budaya";
      badge = "Budaya & Kuliner";
    }

    return {
      id: art.id,
      title: art.title,
      slug: art.slug,
      category,
      badge,
      date: dateFormatted,
      readTime,
      snippet: art.content ? art.content.replace(/<[^>]*>/g, '').substring(0, 150) + "..." : "",
      image: art.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png",
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar navScrolled={true} seo={seo} company={company} toggleMenu={toggleMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Blog Header */}
      <header className="pt-32 pb-16 bg-white relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(192,38,211,0.05),transparent,transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-sm font-semibold mb-4">Inspirasi Perjalanan</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Kisah & <span className="gradient-text">Tips Perjalanan</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Temukan panduan praktis, rekomendasi kuliner, dan kisah seru dari para petualang di keindahan kepulauan Indonesia.
          </p>
        </div>
      </header>

      {/* Grid */}
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="glass-card rounded-3xl overflow-hidden card-hover flex flex-col shadow-lg border border-gray-100/50 reveal active">
                <div className="relative h-60 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
                  <span className={`absolute top-4 left-4 px-3 py-1 ${post.category === 'budaya' ? "bg-accent-600" : post.category === 'tips' ? "bg-green-600" : "bg-primary-600"} rounded-full text-xs font-bold text-white`}>{post.badge}</span>
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 hover:text-primary-600 transition-colors">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">{post.snippet}</p>
                  </div>
                  <Link href={`/${post.slug}`} className="w-full py-3 bg-gray-100 hover:bg-primary-600 hover:text-white rounded-2xl text-sm font-semibold text-gray-700 transition-all flex items-center justify-center gap-2">
                    <span>Baca Selengkapnya</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer seo={seo} cta={{}} company={company} packages={packages} />
    </div>
  );
}
