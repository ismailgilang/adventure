"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Package {
  id: number;
  title: string;
  category: string;
  duration: string;
  rating: string;
  reviews: string;
  price: string;
  image: string;
  badge: string;
  badgeColor: string;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  // References for scroll animations and counters
  const countersRef = useRef<HTMLSpanElement[]>([]);

  // State Konten Dinamis Neon DB (dengan fallback default agar optimis tanpa blank layout)
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [hero, setHero] = useState<any>({
    title: "Wujudkan Petualangan Impianmu Bersama IO Travel",
    subtitle: "Temukan keajaiban alam tersembunyi, rasakan kehangatan budaya nusantara, dan ciptakan kenangan abadi dengan paket wisata eksklusif kami.",
    buttonText: "Pesan Sekarang",
    imageUrl: "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png"
  });
  const [about, setAbout] = useState<any>({
    title: "Tentang Kami",
    subtitle: "Petualangan Terpercaya Anda Sejak 2018",
    description: "Kami adalah agen perjalanan terpercaya yang didedikasikan untuk menghadirkan pengalaman liburan terbaik dan tak terlupakan bagi Anda. Dengan jaringan destinasi luas, pemandu profesional, dan pelayanan bintang lima, kami siap menemani setiap langkah petualangan impian Anda.",
    statsGuests: "12K+",
    statsDestinations: "50+",
    statsGuides: "100+",
    imageUrl: "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1c53a6f25-d82a-4c9b-a4f1-74590a7c94ac.png"
  });
  const [team, setTeam] = useState<any[]>([
    { name: "M. Fahmi Maellana", role: "Founder & CEO", imageUrl: "https://ui-avatars.com/api/?name=M.+Fahmi+Maellana&background=random" },
    { name: "Sarah Amelia", role: "Head of Operations", imageUrl: "https://ui-avatars.com/api/?name=Sarah+Amelia&background=random" },
    { name: "Budi Pratama", role: "Lead Tour Explorer", imageUrl: "https://ui-avatars.com/api/?name=Budi+Pratama&background=random" }
  ]);
  const [testimonials, setTestimonials] = useState<any[]>([
    { name: "Budi Santoso", role: "Solo Traveler", review: "Pelayanan luar biasa! Trip Raja Ampat benar-benar terencana dengan matang dan sangat menyenangkan.", rating: 5, imageUrl: "https://ui-avatars.com/api/?name=Budi+Santoso&background=random" },
    { name: "Diana Lestari", role: "Family Adventurer", review: "Liburan keluarga ke Ubud menjadi momen tak terlupakan berkat panduan profesional dari IO Travel.", rating: 5, imageUrl: "https://ui-avatars.com/api/?name=Diana+Lestari&background=random" }
  ]);
  const [features, setFeatures] = useState<any[]>([
    { title: "Destinasi Pilihan", description: "Kami menawarkan pilihan rute petualangan terbaik dan paling eksotis di seluruh Indonesia.", icon: "compass" },
    { title: "Pemandu Profesional", description: "Setiap destinasi didampingi oleh pemandu lokal berlisensi, berpengalaman, dan ramah.", icon: "users" },
    { title: "Harga Terbaik & Transparan", description: "Fasilitas premium dengan penawaran harga paling jujur tanpa biaya tersembunyi.", icon: "shield" }
  ]);
  const [cta, setCta] = useState<any>({
    title: "Siap Memulai Petualangan Berikutnya?",
    subtitle: "Hubungi tim spesialis perjalanan kami hari ini untuk merencanakan dan mengamankan liburan impian Anda bersama keluarga.",
    buttonText: "Hubungi Kami Via WhatsApp",
    buttonUrl: "https://wa.me/628123456789"
  });

  useEffect(() => {
    // Fetch data dinamis dari Neon DB
    fetch("/api/landing")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.hero) setHero(res.data.hero);
          if (res.data.about) setAbout(res.data.about);
          if (res.data.team && res.data.team.length > 0) setTeam(res.data.team);
          if (res.data.testimonials && res.data.testimonials.length > 0) setTestimonials(res.data.testimonials);
          if (res.data.features && res.data.features.length > 0) setFeatures(res.data.features);
          if (res.data.cta) setCta(res.data.cta);
          if (res.data.packages && res.data.packages.length > 0) setDbPackages(res.data.packages);
        }
      })
      .catch((err) => console.error("Error fetching dynamic landing content:", err));

    // Scroll Listener
    const handleScroll = () => {
      if (window.scrollY > 80) setNavScrolled(true);
      else setNavScrolled(false);

      if (window.scrollY > 500) setBackToTopVisible(true);
      else setBackToTopVisible(false);
    };

    window.addEventListener("scroll", handleScroll);

    // Scroll Reveal Observer
    const revealElements = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealElements.forEach((el) => revealObserver.observe(el));

    const observerInterval = setInterval(() => {
      const revealElements = document.querySelectorAll(".reveal:not(.observed)");
      revealElements.forEach((el) => {
        el.classList.add("observed");
        revealObserver.observe(el);
      });
    }, 500);

    // Stats Counters Observer
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target as HTMLElement;
            const target = parseInt(counter.getAttribute("data-target") || "0");
            const duration = 2000;
            const start = performance.now();

            const animate = (currentTime: number) => {
              const progress = Math.min((currentTime - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * target);

              if (target >= 1000) {
                counter.textContent =
                  (current / 1000).toFixed(progress >= 1 ? 0 : 1) + "K+";
              } else {
                counter.textContent = current + (target === 98 ? "%" : "+");
              }

              if (progress < 1) requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
            counterObserver.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentCounters = countersRef.current;
    currentCounters.forEach((c) => {
      if (c) counterObserver.observe(c);
    });

    return () => {
      clearInterval(observerInterval);
      window.removeEventListener("scroll", handleScroll);
      revealElements.forEach((el) => revealObserver.unobserve(el));
      currentCounters.forEach((c) => {
        if (c) counterObserver.unobserve(c);
      });
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Ubah paket dari Neon DB ke format yang siap dirender di UI
  const packagesList = dbPackages.length > 0 ? dbPackages.map((pkg) => ({
    id: pkg.id,
    title: pkg.name,
    category: ((pkg.slug && pkg.slug.includes("ubud")) || (pkg.name && pkg.name.toLowerCase().includes("ubud"))) ? "budaya" : "petualangan",
    duration: pkg.duration,
    rating: "5.0",
    reviews: "98",
    price: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(pkg.price),
    image: pkg.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png",
    badge: pkg.price > 8000000 ? "Premium Trip" : "Terlaris",
    badgeColor: pkg.price > 8000000 ? "bg-accent-600/90" : "bg-primary-600/90"
  })) : [
    {
      id: 1,
      title: "Ubud Culture & Nature Escape",
      category: "budaya",
      duration: "4 Hari 3 Malam",
      rating: "4.9",
      reviews: "128",
      price: "Rp 3.500.000",
      image: "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png",
      badge: "Budaya & Alam",
      badgeColor: "bg-primary-600/90"
    },
    {
      id: 2,
      title: "Raja Ampat Diving Expeditions",
      category: "petualangan",
      duration: "5 Hari 4 Malam",
      rating: "5.0",
      reviews: "94",
      price: "Rp 12.000.000",
      image: "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/18102e25a-831b-4c33-82cd-517f38151447.png",
      badge: "Premium Trip",
      badgeColor: "bg-accent-600/90"
    },
    {
      id: 3,
      title: "Labuan Bajo Islands Explorer",
      category: "petualangan",
      duration: "4 Hari 3 Malam",
      rating: "4.8",
      reviews: "156",
      price: "Rp 7.500.000",
      image: "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1c53a6f25-d82a-4c9b-a4f1-74590a7c94ac.png",
      badge: "Terlaris",
      badgeColor: "bg-green-600/90"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled ? "nav-scrolled h-20" : "h-24 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <a href="#beranda" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center font-bold text-xl text-white group-hover:scale-110 transition-transform">
                IO
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Travel
              </span>
            </a>

            {/* Desktop Navbar */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#beranda"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group"
              >
                Beranda
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#tentang"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group"
              >
                Tentang Kami
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#paket"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group"
              >
                Paket Wisata
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#keunggulan"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group"
              >
                Keunggulan
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#testimoni"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group"
              >
                Testimoni
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#tim"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group"
              >
                Tim Kami
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link
                href="/blog"
                className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors relative group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/pesan"
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-sm font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all"
              >
                Pesan Sekarang
              </Link>
            </div>

            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100"
              onClick={toggleMenu}
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobileMenu"
        className={`mobile-menu fixed top-0 right-0 h-full w-72 bg-white z-50 p-6 shadow-2xl ${
          menuOpen ? "open" : ""
        }`}
      >
        <button
          onClick={toggleMenu}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="mt-16 flex flex-col gap-4">
          <a
            href="#beranda"
            onClick={toggleMenu}
            className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors"
          >
            Beranda
          </a>
          <a
            href="#tentang"
            onClick={toggleMenu}
            className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors"
          >
            Tentang Kami
          </a>
          <a
            href="#paket"
            onClick={toggleMenu}
            className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors"
          >
            Paket Wisata
          </a>
          <a
            href="#keunggulan"
            onClick={toggleMenu}
            className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors"
          >
            Keunggulan
          </a>
          <a
            href="#testimoni"
            onClick={toggleMenu}
            className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors"
          >
            Testimoni
          </a>
          <a
            href="#tim"
            onClick={toggleMenu}
            className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors"
          >
            Tim Kami
          </a>
          <Link
            href="/blog"
            onClick={toggleMenu}
            className="text-lg font-medium text-gray-700 hover:text-primary-600 py-2 transition-colors"
          >
            Blog
          </Link>
          <hr className="border-gray-200 my-2" />
          <Link
            href="/pesan"
            onClick={toggleMenu}
            className="mt-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-center text-sm font-semibold text-white"
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>
      {menuOpen && (
        <div
          id="menuOverlay"
          className="fixed inset-0 bg-black/30 z-40"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Hero Section */}
      <section
        id="beranda"
        className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-gray-50"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent,transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left reveal active">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 border border-primary-200 text-primary-700 text-sm font-semibold mb-4">
              Jelajahi Surga Nusantara
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {hero.title}
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto lg:mx-0">
              {hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/pesan"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35 transition-all transform hover:-translate-y-0.5 text-center"
              >
                {hero.buttonText || "Pesan Sekarang"}
              </Link>
              <a
                href="#paket"
                className="px-8 py-4 bg-white border border-gray-200 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Lihat Destinasi
              </a>
            </div>
            {/* Stats Counter Grid */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200/80">
              <div>
                <span
                  ref={(el) => {
                    if (el) countersRef.current[0] = el;
                  }}
                  data-target="15"
                  className="block text-3xl font-extrabold text-gray-900"
                >
                  0+
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Destinasi
                </span>
              </div>
              <div>
                <span
                  ref={(el) => {
                    if (el) countersRef.current[1] = el;
                  }}
                  data-target="10000"
                  className="block text-3xl font-extrabold text-gray-900"
                >
                  0+
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Wisatawan
                </span>
              </div>
              <div>
                <span
                  ref={(el) => {
                    if (el) countersRef.current[2] = el;
                  }}
                  data-target="98"
                  className="block text-3xl font-extrabold text-gray-900"
                >
                  0%
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Puas
                </span>
              </div>
            </div>
          </div>
          {/* Hero Image Block */}
          <div className="lg:col-span-6 relative flex justify-center reveal active">
            <div className="w-[300px] h-[400px] sm:w-[350px] sm:h-[450px] rounded-[48px] overflow-hidden shadow-2xl border-8 border-white transform -rotate-6 z-10 hover:rotate-0 transition-transform duration-500 bg-gray-100">
              <img
                src={hero.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png"}
                alt="Bali Experience"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-[20%] -translate-y-[40%] w-[260px] h-[360px] sm:w-[300px] sm:h-[400px] rounded-[48px] overflow-hidden shadow-2xl border-8 border-white rotate-12 hover:rotate-0 transition-transform duration-500 bg-gray-100">
              <img
                src={hero.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/18102e25a-831b-4c33-82cd-517f38151447.png"}
                alt="Raja Ampat Expeditions"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section id="tentang" className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 relative reveal">
            <div className="relative rounded-[48px] overflow-hidden shadow-2xl aspect-[4/3] group bg-gray-100">
              <img
                src={about.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1c53a6f25-d82a-4c9b-a4f1-74590a7c94ac.png"}
                alt={about.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
          </div>
          <div className="lg:col-span-6 space-y-6 reveal">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-100 border border-accent-200 text-accent-700 text-sm font-semibold">
              Tentang Kami
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              {about.title} <span className="gradient-text">{about.subtitle}</span>
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Paket Wisata Section */}
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
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 ${p.badgeColor} rounded-full text-xs font-bold text-white`}
                  >
                    {p.badge}
                  </span>
                </div>
                <div className="p-8">
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">
                    {p.duration}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {p.title}
                  </h3>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block">
                        Mulai dari
                      </span>
                      <span className="text-lg font-extrabold text-primary-600">
                        {p.price}
                      </span>
                    </div>
                    <Link
                      href="/pesan"
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition-colors"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section
        id="keunggulan"
        className="py-24 relative overflow-hidden bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 reveal">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-100 border border-accent-200 text-accent-700 text-sm font-semibold mb-4">
              Mengapa Memilih Kami?
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Layanan <span className="gradient-text">Terbaik</span> Untuk Anda
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 shadow-md card-hover reveal flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                    {f.icon === "compass" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                    {f.icon === "users" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
                    {f.icon === "shield" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                    {f.icon === "support" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoni Section */}
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
                      <svg key={starIndex} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed italic mb-6">
                    "{t.review}"
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={t.imageUrl || "/testi/default.jpg"}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
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

      {/* Tim Kami Section */}
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
                  <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary-500/20 group bg-gray-100">
                    <img
                      src={m.imageUrl || "/team/default.jpg"}
                      alt={m.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {m.name}
                  </h3>
                  <p className="text-primary-600 text-xs font-semibold uppercase tracking-wider mb-4">
                    {m.role}
                  </p>
                </div>
                {m.instagramUrl && (
                  <a
                    href={m.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="kontak"
        className="py-24 relative overflow-hidden bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="rounded-[40px] overflow-hidden relative shadow-2xl">
            <img
              src="https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/16c95331d-45f5-47ca-945b-32aa2bc0912d.png"
              alt="CTA"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/85 to-accent-800/80"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-2xl px-8 sm:px-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
                  {cta.title}
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  {cta.subtitle}
                </p>
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

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center font-bold text-xl text-white">
                  IO
                </div>
                <span className="text-xl font-bold text-gray-900">Travel</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Partner perjalanan terpercaya Anda sejak 2018.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-900">
                Destinasi
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#paket"
                    className="text-gray-500 hover:text-primary-600 transition-colors text-sm"
                  >
                    Bali
                  </a>
                </li>
                <li>
                  <a
                    href="#paket"
                    className="text-gray-500 hover:text-primary-600 transition-colors text-sm"
                  >
                    Raja Ampat
                  </a>
                </li>
                <li>
                  <a
                    href="#paket"
                    className="text-gray-500 hover:text-primary-600 transition-colors text-sm"
                  >
                    Labuan Bajo
                  </a>
                </li>
                <li>
                  <a
                    href="#paket"
                    className="text-gray-500 hover:text-primary-600 transition-colors text-sm"
                  >
                    Lombok
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-900">Layanan</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#paket"
                    className="text-gray-500 hover:text-primary-600 transition-colors text-sm"
                  >
                    Paket Domestik
                  </a>
                </li>
                <li>
                  <a
                    href="#paket"
                    className="text-gray-500 hover:text-primary-600 transition-colors text-sm"
                  >
                    Paket Internasional
                  </a>
                </li>
                <li>
                  <a
                    href="#paket"
                    className="text-gray-500 hover:text-primary-600 transition-colors text-sm"
                  >
                    Honeymoon
                  </a>
                </li>
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
            <p className="text-gray-400 text-sm">
              © 2026 IO Travel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      {backToTopVisible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/20 text-white transition-all duration-300 hover:scale-110 z-40"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform z-40"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
