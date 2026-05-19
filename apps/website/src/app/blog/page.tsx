"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ArticleData {
  title: string;
  badge: string;
  badgeColor: string;
  date: string;
  image: string;
  body: string;
}

export default function BlogPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [dbArticles, setDbArticles] = useState<any[]>([]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          const published = res.data.filter((a: any) => a.status === "PUBLISHED");
          setDbArticles(published);
        }
      })
      .catch((err) => console.error("Gagal mengambil artikel dari Neon DB:", err));
  }, []);

  const blogPosts = dbArticles.length > 0 ? dbArticles.map((art) => {
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
  }) : [
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
        <p class="mb-4"><b>1. Siapkan Perizinan (KPJL)</b><br/>Setiap wisatawan asing maupun lokal yang ingin masuk ke Raja Ampat wajib membayar Kartu Pemeliharaan Jasa Lingkungan (KPJL) yang digunakan untuk kelestarian laut setempat. Pastikan Anda mengurusnya setiba di Waisai.</p>
        <p class="mb-4"><b>2. Pilih Waktu Terbaik (Oktober - April)</b><br/>Bulan-bulan ini adalah waktu ideal karena laut cenderung sangat tenang dengan visibilitas bawah air yang luar biasa jernih. Cocok bagi Anda yang ingin snorkeling atau selam scuba.</p>
        <p class="mb-4"><b>3. Bawa Uang Tunai Secukupnya</b><br/>Mesin ATM sangat terbatas di area kepulauan Raja Ampat. Pastikan Anda menarik uang tunai yang cukup saat berada di kota Sorong untuk membayar akomodasi lokal dan sewa perahu.</p>
        <p class="mb-4"><b>4. Gunakan Tabir Surya Ramah Lingkungan</b><br/>Guna melindungi ekosistem karang yang berharga, gunakan tabir surya fisik (physical sunscreen) yang berlabel <i>coral-reef safe</i> (bebas oxybenzone).</p>
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
        <p class="mb-4">Ubud menyajikan keheningan dan keindahan budaya Bali yang autentik. Salah satu ikon terbaiknya adalah sawah bertingkat Tegalalang. Kehijauan sawah yang berundak indah bukan sekadar komoditas visual komersial, melainkan bagian dari sejarah panjang sistem pengairan <b>Subak</b>.</p>
        <p class="mb-4">Subak adalah sebuah manifestasi filosofi masyarakat Hindu Bali, yaitu <i>Tri Hita Karana</i>, yang menekankan hubungan harmonis antara manusia dengan Tuhan, manusia dengan sesama, dan manusia dengan alam sekitarnya.</p>
        <p class="mb-4">Datanglah pukul 06.00 WITA. Kabut tipis yang menyelimuti terasering berpadu dengan sorot cahaya emas matahari terbit menyajikan panorama magis yang tiada duanya. Anda juga dapat berbincang langsung dengan para petani lokal yang memelihara ekosistem sawah ini dengan cara-cara tradisional yang turun-temurun.</p>
      `
    },
    {
      id: 3,
      title: "Tips Packing Efisien Untuk Solo Traveling 7 Hari",
      slug: "tips-packing-efisien-untuk-solo-traveling-7-hari",
      category: "tips",
      badge: "Tips & Trik",
      badgeColor: "bg-green-600/90",
      date: "10 Mei 2026",
      readTime: "Baca 3 Menit",
      snippet: "Packing berlebihan hanya akan menguras energi Anda selama berlibur. Pelajari teknik roll-folding pakaian, pemilihan tas backpack kabin yang tepat, serta barang medis krusial.",
      image: "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1c53a6f25-d82a-4c9b-a4f1-74590a7c94ac.png",
      body: `
        <p class="mb-4">Bepergian sendirian membutuhkan efisiensi mobilitas yang tinggi. Membawa koper besar saat berpindah pulau atau naik kapal kecil akan sangat merepotkan. Berikut adalah tips ringkas mengemas barang Anda:</p>
        <p class="mb-4"><b>1. Metode Gulung (Roll Folding)</b><br/>Menggulung baju alih-alih melipatnya akan meminimalkan lipatan kusut dan memangkas ruang koper hingga 30%.</p>
        <p class="mb-4"><b>2. Formula 5-4-3-2-1</b><br/>Untuk trip 7 hari, cukup bawa 5 pasang pakaian dalam, 4 atasan kasual, 3 bawahan (celana/rok), 2 pasang sepatu nyaman (satu dipakai), dan 1 topi/aksesori pelindung panas.</p>
        <p class="mb-4"><b>3. Pisahkan Botol Cairan Mini</b><br/>Selalu gunakan botol travel-size berukuran di bawah 100ml dan wadahi dalam tas transparan ziplock untuk mempermudah pemeriksaan bandara.</p>
      `
    }
  ];

  const filteredPosts =
    activeFilter === "all"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 nav-scrolled h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center font-bold text-xl text-white group-hover:scale-110 transition-transform">IO</div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Travel</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#beranda" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group">Beranda</Link>
              <Link href="/#tentang" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group">Tentang Kami</Link>
              <Link href="/#paket" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group">Paket Wisata</Link>
              <Link href="/#keunggulan" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group">Keunggulan</Link>
              <Link href="/#testimoni" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group">Testimoni</Link>
              <Link href="/#tim" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group">Tim Kami</Link>
              <Link href="/blog" className="text-sm font-semibold text-primary-600 relative group">
                Blog
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500"></span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/pesan" className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all">Pesan Sekarang</Link>
            </div>
            <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100" onClick={toggleMenu}>
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div id="mobileMenu" className={`mobile-menu fixed top-0 right-0 h-full w-72 bg-white z-50 p-6 shadow-2xl ${menuOpen ? "open" : ""}`}>
        <button onClick={toggleMenu} className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100"><svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        <div className="mt-16 flex flex-col gap-4">
          <Link href="/#beranda" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Beranda</Link>
          <Link href="/#tentang" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Tentang Kami</Link>
          <Link href="/#paket" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Paket Wisata</Link>
          <Link href="/#keunggulan" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Keunggulan</Link>
          <Link href="/#testimoni" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Testimoni</Link>
          <Link href="/#tim" onClick={toggleMenu} className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors">Tim Kami</Link>
          <Link href="/blog" onClick={toggleMenu} className="text-lg font-semibold text-primary-600 py-2 transition-colors">Blog</Link>
          <hr className="border-gray-200 my-2"/>
          <Link href="/pesan" onClick={toggleMenu} className="mt-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-center text-sm font-semibold text-white">Pesan Sekarang</Link>
        </div>
      </div>
      {menuOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={toggleMenu}></div>}

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

      {/* Filters and Grid */}
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Categories */}
          <div className="flex justify-center gap-3 mb-12 flex-wrap">
            <button onClick={() => setActiveFilter("all")} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeFilter === "all" ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25" : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"}`}>Semua</button>
            <button onClick={() => setActiveFilter("destinasi")} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeFilter === "destinasi" ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25" : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"}`}>Panduan Wisata</button>
            <button onClick={() => setActiveFilter("tips")} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeFilter === "tips" ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25" : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"}`}>Tips & Trik</button>
            <button onClick={() => setActiveFilter("budaya")} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeFilter === "budaya" ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25" : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600"}`}>Budaya & Kuliner</button>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="glass-card rounded-3xl overflow-hidden card-hover flex flex-col shadow-lg border border-gray-100/50 reveal active">
                <div className="relative h-60 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
                  <span className={`absolute top-4 left-4 px-3 py-1 ${post.id === 2 ? "bg-accent-600" : post.id === 3 ? "bg-green-600" : "bg-primary-600"} rounded-full text-xs font-bold text-white`}>{post.badge}</span>
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

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center font-bold text-xl text-white">IO</div>
                <span className="text-xl font-bold text-gray-900">Travel</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Partner perjalanan terpercaya Anda sejak 2018.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-900">Destinasi</h4>
              <ul className="space-y-3">
                <li><Link href="/#paket" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Bali</Link></li>
                <li><Link href="/#paket" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Raja Ampat</Link></li>
                <li><Link href="/#paket" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Labuan Bajo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-900">Layanan</h4>
              <ul className="space-y-3">
                <li><Link href="/#paket" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Paket Domestik</Link></li>
                <li><Link href="/#paket" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Paket Internasional</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-900">Kontak</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li>+62 812-3456-7890</li>
                <li>hello@iotravel.id</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© 2026 IO Travel. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
