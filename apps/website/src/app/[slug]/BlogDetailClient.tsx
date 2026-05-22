"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";
import { ImageWithSkeleton } from "@/components/ui/Skeleton";

interface ArticleData {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  badge: string;
  badgeColor: string;
  date: string;
  readTime: string;
  snippet: string;
  image: string;
  body: string;
}

interface BlogDetailClientProps {
  article: any;
  recommended: any[];
  seo: any;
  company?: any;
  slug: string;
}

export default function BlogDetailClient({ article: dbArticle, recommended: dbRecommended, seo, company, slug }: BlogDetailClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const fallbackArticles = [
    {
      id: 1,
      title: "5 Panduan Lengkap Sebelum Berkunjung Ke Raja Ampat",
      slug: "5-panduan-lengkap-sebelum-berkunjung-ke-raja-ampat",
      category: "destinasi",
      badge: "Panduan Wisata",
      badgeColor: "bg-primary-600/90",
      date: "18 Mei 2026",
      readTime: "Baca 5 Menit",
      snippet: "Raja Ampat adalah surga dunia yang berada di bagian timur Indonesia. Sebelum berangkat ke gugusan pulau eksotis ini, pastikan Anda memahami perizinan, musim terbaik, dan peralatan diving.",
      image: "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/18102e25a-831b-4c33-82cd-517f38151447.png",
      body: `
        <p class="mb-6">Raja Ampat adalah surga dunia yang berada di bagian timur Indonesia. Keindahan bawah lautnya yang legendaris, jajaran pulau karang eksotis, dan keunikan budaya lokalnya menjadikan destinasi ini impian setiap pelancong.</p>
        <p class="mb-6"><b>1. Siapkan Perizinan (KPJL)</b><br/>Setiap wisatawan asing maupun lokal yang ingin masuk ke Raja Ampat wajib membayar Kartu Pemeliharaan Jasa Lingkungan (KPJL) yang digunakan untuk kelestarian laut setempat. Pastikan Anda mengurusnya setiba di Waisai.</p>
        <p class="mb-6"><b>2. Pilih Waktu Terbaik (Oktober - April)</b><br/>Bulan-bulan ini adalah waktu ideal karena laut cenderung sangat tenang with visibilitas bawah air yang luar biasa jernih. Cocok bagi Anda yang ingin snorkeling atau selam scuba.</p>
        <p class="mb-6"><b>3. Bawa Uang Tunai Secukupnya</b><br/>Mesin ATM sangat terbatas di area kepulauan Raja Ampat. Pastikan Anda menarik uang tunai yang cukup saat berada di kota Sorong untuk membayar akomodasi lokal and sewa perahu.</p>
        <p class="mb-6"><b>4. Gunakan Tabir Surya Ramah Lingkungan</b><br/>Guna melindungi ekosistem karang yang berharga, gunakan tabir surya fisik (physical sunscreen) yang berlabel <i>coral-reef safe</i> (bebas oxybenzone).</p>
      `
    },
    {
      id: 2,
      title: "Keajaiban Budaya & Sunrise Eksotis di Tegalalang, Ubud",
      slug: "keajaiban-budaya-sunrise-eksotis-di-tegalalang-ubud",
      category: "budaya",
      badge: "Budaya & Kuliner",
      badgeColor: "bg-accent-600/90",
      date: "15 Mei 2026",
      readTime: "Baca 4 Menit",
      snippet: "Ubud tidak sekadar tentang ketenangan. Hijaunya sawah terasering Tegalalang menyembunyikan cerita sistem perairan Subak yang diakui UNESCO serta kearifan lokal masyarakat adat.",
      image: "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png",
      body: `
        <p class="mb-6">Ubud menyajikan keheningan dan keindahan budaya Bali yang autentik. Salah satu ikon terbaiknya adalah sawah bertingkat Tegalalang. Kehijauan sawah yang berundak indah bukan sekadar komoditas visual komersial, melainkan bagian dari sejarah panjang sistem pengairan <b>Subak</b>.</p>
        <p class="mb-6">Subak adalah sebuah manifestasi filosofi masyarakat Hindu Bali, yaitu <i>Tri Hita Karana</i>, yang menekankan hubungan harmonis antara manusia dengan Tuhan, manusia dengan sesama, dan manusia dengan alam sekitarnya.</p>
        <p class="mb-6">Datanglah pukul 06.00 WITA. Kabut tipis yang menyelimuti terasering berpadu dengan sorot cahaya emas matahari terbit menyajikan panorama magis yang tiada duanya. Anda juga dapat berbincang langsung dengan para petani lokal yang memelihara ekosistem sawah ini dengan cara-cara tradisional yang turun-temurun.</p>
      `
    }
  ];

  const mapArticle = (art: any) => {
    if (!art) return null;
    const wordCount = art.content ? art.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
    const readTime = `${Math.max(3, Math.ceil(wordCount / 200))} Menit Baca`;
    const dateFormatted = new Date(art.createdAt || Date.now()).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    
    let category = "tips";
    let badge = "Tips & Trik";
    let badgeColor = "bg-green-600/90";
    if (art.title.toLowerCase().includes("panduan") || art.title.toLowerCase().includes("raja ampat") || art.title.toLowerCase().includes("wisata")) {
      category = "destinasi";
      badge = "Panduan Wisata";
      badgeColor = "bg-primary-600/90";
    } else if (art.title.toLowerCase().includes("budaya") || art.title.toLowerCase().includes("ubud") || art.title.toLowerCase().includes("kuliner")) {
      category = "budaya";
      badge = "Budaya & Kuliner";
      badgeColor = "bg-accent-600/90";
    }

    return {
      id: art.id,
      title: art.title,
      slug: art.slug,
      category,
      badge,
      badgeColor,
      date: dateFormatted,
      readTime,
      snippet: art.content ? art.content.replace(/<[^>]*>/g, '').substring(0, 150) + "..." : "",
      image: art.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png",
      body: art.content || ""
    };
  };

  const article = mapArticle(dbArticle) || fallbackArticles.find(a => a.slug === slug);
  const recommended = dbRecommended.length > 0 ? dbRecommended.map(mapArticle) : fallbackArticles.filter(a => a.slug !== slug);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar navScrolled={true} seo={seo} company={company} toggleMenu={toggleMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Main Details */}
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-8 transition-colors group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            <span>Kembali ke Blog</span>
          </Link>

          {article ? (
            <article className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${article.badgeColor}`}>{article.badge}</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                  {article.title}
                </h1>
              </div>

              {/* Cover Image */}
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-video border border-gray-100 bg-gray-100">
                <ImageWithSkeleton
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 text-base pt-6 border-t border-gray-100" 
                dangerouslySetInnerHTML={{ __html: article.body }}
              ></div>

              {/* Recommended Articles Section */}
              {recommended.length > 0 && (
                <div className="pt-16 border-t border-gray-200 mt-16 space-y-8">
                  <h3 className="text-2xl font-black text-gray-900">Rekomendasi Ulasan Lainnya</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommended.map((item: any) => (
                      <Link href={`/${item.slug}`} key={item.id} className="glass-card rounded-2xl p-5 block hover:shadow-xl transition-all border border-gray-100/50 group flex flex-col justify-between">
                        <div>
                          <div className="rounded-xl overflow-hidden h-36 mb-4 bg-gray-100">
                            <ImageWithSkeleton
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              containerClassName="w-full h-full"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 block mb-2">{item.date}</span>
                          <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">{item.title}</h4>
                        </div>
                        <span className="text-xs font-semibold text-primary-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-4">
                          Baca Artikel →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ) : (
            <div className="py-20 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Artikel Tidak Ditemukan</h2>
              <p className="text-gray-500 mb-6 text-sm">Maaf, ulasan perjalanan yang Anda cari tidak tersedia atau telah dihapus.</p>
              <Link href="/blog" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">Kembali Jelajahi Blog</Link>
            </div>
          )}

        </div>
      </main>

      <Footer seo={seo} cta={{}} company={company} />
    </div>
  );
}
