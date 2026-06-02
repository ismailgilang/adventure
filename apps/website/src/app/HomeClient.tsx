"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Packages from "@/components/landing/Packages";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Team from "@/components/landing/Team";
import Quote from "@/components/landing/Quote";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop";

interface HomeClientProps {
  hero: any;
  about: any;
  team: any[];
  testimonials: any[];
  features: any[];
  cta: any;
  packages: any[];
  seo: any;
  company: any;
  quotes: any;
}

export default function HomeClient({
  hero,
  about,
  team,
  testimonials,
  features,
  cta,
  packages,
  seo,
  company,
  quotes,
}: HomeClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);

  // References for scroll animations and counters
  const countersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
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

  // Ubah paket ke format yang siap dirender di UI (Hanya ambil 3 terbaru)
  const packagesList = packages.length > 0 ? packages.slice(0, 3).map((pkg) => ({
    id: pkg.id,
    title: pkg.name,
    slug: pkg.slug,
    category: ((pkg.slug && pkg.slug.includes("ubud")) || (pkg.name && pkg.name.toLowerCase().includes("ubud"))) ? "budaya" : "petualangan",
    duration: pkg.duration,
    rating: "5.0",
    reviews: "98",
    price: pkg.price > 0 ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(pkg.price) : null,
    image: pkg.imageUrl || "https://image.qwenlm.ai/public_source/3524cccd-e29b-4d9f-9189-5394346ea852/1254e5187-8d09-4038-9944-a45fab0e7943.png",
  })) : [];

  // Handle WhatsApp URL based on company profile
  const finalCta = { ...cta };
  if (company?.whatsapp) {
    const waNumber = company.whatsapp.replace(/[^0-9]/g, "");
    finalCta.buttonUrl = `https://wa.me/${waNumber}`;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar navScrolled={navScrolled} seo={seo} company={company} toggleMenu={toggleMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      
      <main>
        <Hero hero={hero} countersRef={countersRef} />
        <Quote quotes={quotes} />
        <About about={about} />
        <Packages packagesList={packagesList} />
        <Features features={features} />
        <Testimonials testimonials={testimonials} />
        <Team team={team} />
        <CTA cta={finalCta} />
      </main>

      <Footer seo={seo} cta={finalCta} company={company} packages={packages} />
      <BackToTop visible={backToTopVisible} />
    </div>
  );
}
