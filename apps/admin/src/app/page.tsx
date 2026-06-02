"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";
import ConfirmationModal from "../components/ConfirmationModal";

export default function AdminPage() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Tab & content states
  const [activeTab, setActiveTab] = useState<"dashboard" | "packages" | "articles" | "bookings" | "landing" | "company" | "gallery" | "users" | "seo">("dashboard");
  const [activeLandingSubTab, setActiveLandingSubTab] = useState<"hero" | "about" | "features" | "testimonials" | "team" | "cta" | "quotes">("hero");

  // Database State Lists
  const [packages, setPackages] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  // Config tables (Hero, About, CTA, Meta, Company)
  const [hero, setHero] = useState<any>({ title: "", subtitle: "", buttonText: "", imageUrl: "" });
  const [about, setAbout] = useState<any>({ title: "", subtitle: "", description: "", statsGuests: "", statsDestinations: "", statsGuides: "", imageUrl: "" });
  const [quotes, setQuotes] = useState<any>({ title: "" });
  const [cta, setCta] = useState<any>({ title: "", subtitle: "", buttonText: "", buttonUrl: "" });
  const [seo, setSeo] = useState<any>({ 
    title: "", 
    description: "", 
    keywords: "", 
    logoUrl: "", 
    faviconUrl: "", 
    ogTitle: "", 
    ogDescription: "", 
    ogImage: "", 
    twitterCard: "summary_large_image",
    canonicalUrl: "",
    robots: "index, follow"
  });
  const [company, setCompany] = useState<any>({
    name: "",
    tagline: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    whatsapp: "",
    mapsUrl: "",
    vision: "",
    mission: "",
    history: ""
  });

  // Modal control & Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"packages" | "articles" | "team" | "testimonials" | "features" | "users" | "gallery" | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ table: string; id: string } | null>(null);

  // Form input bindings
  const [pkgForm, setPkgForm] = useState({ name: "", price: 0, duration: "", description: "", imageUrl: "", category: "wisata", status: "DRAFT" });
  const [artForm, setArtForm] = useState({ title: "", content: "", imageUrl: "", status: "DRAFT" });
  const [teamForm, setTeamForm] = useState({ name: "", role: "", imageUrl: "", instagramUrl: "" });
  const [testForm, setTestForm] = useState({ name: "", role: "", review: "", rating: 5, imageUrl: "" });
  const [featForm, setFeatForm] = useState({ title: "", description: "", icon: "compass" });
  const [userForm, setUserForm] = useState({ username: "", password: "", name: "", role: "ADMIN" });
  const [galleryForm, setGalleryForm] = useState({ title: "", imageUrl: "", category: "GENERAL" });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const loadAllData = async () => {
    try {
      const getTable = async (table: string) => {
        const res = await fetch(`/api/crud?table=${table}`);
        const data = await res.json();
        return data.success ? data.data : [];
      };

      const [pkgs, arts, bks, tm, test, feats, usrs, hr, ab, ct, mt, comp, gal, qt] = await Promise.all([
        getTable("packages"),
        getTable("articles"),
        getTable("bookings"),
        getTable("team"),
        getTable("testimonials"),
        getTable("features"),
        getTable("users"),
        getTable("hero"),
        getTable("about"),
        getTable("cta"),
        getTable("meta"),
        getTable("company"),
        getTable("gallery"),
        getTable("quotes"),
      ]);

      setPackages(pkgs || []);
      setArticles(arts || []);
      setBookings(bks || []);
      setTeam(tm || []);
      setTestimonials(test || []);
      setFeatures(feats || []);
      setUsers(usrs || []);
      setGallery(gal || []);

      if (hr && hr.length > 0) setHero(hr[0]);
      if (ab && ab.length > 0) setAbout(ab[0]);
      if (ct && ct.length > 0) setCta(ct[0]);
      if (mt && mt.length > 0) setSeo(mt[0]);
      if (comp && comp.length > 0) setCompany(comp[0]);
      if (qt && qt.length > 0) setQuotes(qt[0]);

    } catch (err) {
      console.error("Gagal memuat data dari database Neon:", err);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadAllData();
    }
  }, [isLoggedIn]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (result.success) {
        setIsLoggedIn(true);
      } else {
        setLoginError(result.message || "Username atau Password salah!");
      }
    } catch (err: any) {
      setLoginError("Gagal terhubung ke database Neon. Coba beberapa saat lagi.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setIsLoggedIn(false);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Logout failed", err);
      // Fallback
      setIsLoggedIn(false);
    }
  };

  // CRUD Operations handler
  const handleSaveConfig = async (section: "hero" | "about" | "cta" | "meta" | "company" | "quotes", payload: any) => {
    try {
      const recordId = section === "meta" ? "seo_config" : section === "company" ? "company_config" : section === "quotes" ? "quotes_content" : `${section}_content`;
      const response = await fetch(`/api/crud?table=${section === "meta" ? "meta" : section}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: recordId })
      });
      const res = await response.json();
      if (res.success) {
        toast.success(`${section === "meta" ? "SEO & Branding" : section === "company" ? "Profil Perusahaan" : "Konfigurasi landing page"} berhasil disimpan!`);
        loadAllData();
      } else {
        toast.error(res.message || "Gagal menyimpan konfigurasi.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi.");
    }
  };

  const handleDelete = async (table: string, id: string) => {
    setDeleteConfirm({ table, id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { table, id } = deleteConfirm;
    setDeleteConfirm(null);
    try {
      const response = await fetch(`/api/crud?table=${table}&id=${id}`, {
        method: "DELETE"
      });
      const res = await response.json();
      if (res.success) {
        toast.success("Data berhasil dihapus!");
        loadAllData();
      } else {
        toast.error(res.message || "Gagal menghapus data.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi.");
    }
  };

  const handleToggleStatus = async (table: "packages" | "articles", item: any) => {
    const nextStatus = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const response = await fetch(`/api/crud?table=${table}&id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const res = await response.json();
      if (res.success) {
        loadAllData();
      }
    } catch (err) {
      toast.error("Gagal mengubah status.");
    }
  };

  const handleBookingStatusChange = async (bookingId: string, nextStatus: string) => {
    try {
      const response = await fetch(`/api/crud?table=bookings&id=${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const res = await response.json();
      if (res.success) {
        loadAllData();
      }
    } catch (err) {
      toast.error("Gagal mengubah status booking.");
    }
  };

  const handleOpenAdd = (type: typeof modalType) => {
    setModalType(type);
    setEditItem(null);
    // Reset forms
    setPkgForm({ name: "", price: 0, duration: "", description: "", imageUrl: "", category: "wisata", status: "DRAFT" });
    setArtForm({ title: "", content: "", imageUrl: "", status: "DRAFT" });
    setTeamForm({ name: "", role: "", imageUrl: "", instagramUrl: "" });
    setTestForm({ name: "", role: "", review: "", rating: 5, imageUrl: "" });
    setFeatForm({ title: "", description: "", icon: "compass" });
    setUserForm({ username: "", password: "", name: "", role: "ADMIN" });
    setGalleryForm({ title: "", imageUrl: "", category: "GENERAL" });
    setShowAddModal(true);
  };

  const handleOpenEdit = (type: typeof modalType, item: any) => {
    setModalType(type);
    setEditItem(item);
    if (type === "packages") setPkgForm({ ...item });
    if (type === "articles") setArtForm({ ...item });
    if (type === "team") setTeamForm({ ...item });
    if (type === "testimonials") setTestForm({ ...item });
    if (type === "features") setFeatForm({ ...item });
    if (type === "gallery") setGalleryForm({ ...item });
    if (type === "users") setUserForm({ ...item, password: "" }); // Jangan pasang hashed password
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const table = modalType === "packages" ? "packages" : modalType as string;
    let payload: any = {};
    if (modalType === "packages") payload = pkgForm;
    if (modalType === "articles") payload = artForm;
    if (modalType === "team") payload = teamForm;
    if (modalType === "testimonials") payload = testForm;
    if (modalType === "features") payload = featForm;
    if (modalType === "gallery") payload = galleryForm;
    if (modalType === "users") {
      payload = { ...userForm };
      if (!payload.password && editItem) {
        delete payload.password; // Jangan update password jika dikosongkan saat edit
      }
    }

    try {
      let response;
      if (editItem) {
        response = await fetch(`/api/crud?table=${table}&id=${editItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`/api/crud?table=${table}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      const res = await response.json();
      if (res.success) {
        setShowAddModal(false);
        toast.success(editItem ? "Data berhasil diperbarui!" : "Data berhasil disimpan!");
        loadAllData();
      } else {
        toast.error(res.message || "Gagal menyimpan data.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi.");
    }
  };

  // 1. Render Loading State if checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Render Login Form if NOT logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 relative overflow-hidden">
        {/* Colorful gradient mesh background */}
        <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vh] rounded-full bg-indigo-200/50 filter blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vh] rounded-full bg-teal-200/50 filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-md w-full glass-panel rounded-3xl p-10 border border-white/80 shadow-2xl relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            {seo?.logoUrl ? (
              <img src={seo.logoUrl} alt="Logo" className="w-12 h-12 rounded-2xl object-cover shadow-lg" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center font-bold text-2xl text-white shadow-lg">ES</div>
            )}
            <div>
              <span className="text-xl font-black tracking-tight text-slate-800 block">{company?.name || "EO Situ Cileunca"}</span>
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Management Control</span>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-800 text-center mb-1">Masuk Administrator</h2>
          <p className="text-xs text-slate-400 text-center mb-8">Masukkan kredensial admin Anda untuk membuka panel navigasi.</p>

          <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/80 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/80 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800 text-sm transition-all"
              />
            </div>

            {loginError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-center text-sm cursor-pointer"
            >
              {isLoggingIn ? "Menyambungkan..." : "Masuk Sekarang"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Render Main Admin Dashboard (Light Slate-Indigo Theme)
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 antialiased relative">
      {/* Sidebar Panel */}
      <aside className="w-64 glass-panel border-r border-slate-200/80 flex flex-col justify-between py-8 px-6 flex-shrink-0 z-10">
        <div>
          {/* Dashboard Logo */}
          <div className="flex items-center gap-3 mb-10">
            {seo?.logoUrl ? (
              <img src={seo.logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-md" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center font-bold text-xl text-white shadow-md">ES</div>
            )}
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-800 block">{company?.name || "EO Situ Cileunca"}</span>
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Control Panel</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === "dashboard"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab("packages")}
              className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === "packages"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span>Paket Wisata</span>
            </button>
            <button
              onClick={() => setActiveTab("articles")}
              className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === "articles"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              <span>Artikel Blog</span>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === "bookings"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              <span>Data Booking</span>
            </button>

            <div className="pt-4 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">Master Data</span>
            </div>

            <button
              onClick={() => setActiveTab("company")}
              className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === "company"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span>Profil Perusahaan</span>
            </button>

            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === "gallery"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>Galeri Foto</span>
            </button>

            <button
              onClick={() => setActiveTab("landing")}
              className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === "landing"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              <span>Konten Landing</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === "users"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <span>Akun Admin</span>
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all cursor-pointer ${activeTab === "seo"
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              <span>SEO & Branding</span>
            </button>
          </nav>
        </div>

        {/* User Card with Logout capability */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center font-bold text-white text-sm">AD</div>
            <div>
              <span className="text-sm font-bold text-slate-800 block leading-tight">Admin Utama</span>
              <span className="text-xs text-slate-400">Super Admin</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Keluar Panel
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-10 overflow-y-auto max-h-screen z-10">
        {/* Header Bar */}
        <header className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200/80">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight capitalize">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "packages" && "Kelola Paket Wisata"}
              {activeTab === "articles" && "Kelola Artikel Blog"}
              {activeTab === "bookings" && "Kelola Data Pemesanan"}
              {activeTab === "landing" && "Kelola Konten Landing Page"}
              {activeTab === "company" && "Kelola Profil Perusahaan"}
              {activeTab === "gallery" && "Kelola Galeri Foto"}
              {activeTab === "users" && "Kelola Akun Administrator"}
              {activeTab === "seo" && "SEO & Branding Settings"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Selamat datang kembali, Admin. Pantau dan kelola seluruh petualangan {company?.name || "EO Situ Cileunca"} Anda di sini.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-500 flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              Live Sync Neon DB
            </span>
          </div>
        </header>

        {/* Tab 1: Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-10">
            {/* Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Total Reservasi</span>
                <span className="text-4xl font-extrabold text-slate-800">{bookings.length}</span>
                <span className="text-xs text-indigo-600 font-semibold mt-3 flex items-center gap-1">
                  ↑ Live dari Database
                </span>
              </div>
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Pendapatan Kotor</span>
                <span className="text-4xl font-extrabold text-slate-800">
                  {formatRupiah(bookings.reduce((sum, b) => b.status === "selesai" ? sum + b.totalPrice : sum, 0))}
                </span>
                <span className="text-xs text-teal-600 font-semibold mt-3 flex items-center gap-1">
                  Khusus booking terkonfirmasi
                </span>
              </div>
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Artikel Aktif</span>
                <span className="text-4xl font-extrabold text-slate-800">
                  {articles.filter((a) => a.status === "PUBLISHED").length}
                </span>
                <span className="text-xs text-slate-500 font-semibold mt-3">
                  {articles.filter((a) => a.status === "DRAFT").length} masih draft
                </span>
              </div>
              <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Total Paket</span>
                <span className="text-4xl font-extrabold text-slate-800">{packages.length}</span>
                <span className="text-xs text-indigo-600 font-semibold mt-3">
                  Pilihan rute petualangan
                </span>
              </div>
            </div>

            {/* Quick Insights & Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Chart Placeholder */}
              <div className="lg:col-span-8 glass-card p-8 rounded-2xl">
                <h3 className="text-base font-bold mb-4 text-slate-800">Visualisasi Aktivitas Booking</h3>
                <div className="h-64 rounded-xl border border-slate-200 bg-white/40 flex items-center justify-center text-sm text-slate-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent"></div>
                  <svg className="w-full h-full p-4 text-indigo-500/80" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M 0 35 Q 20 20 40 30 T 80 10 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 0 38 Q 20 25 40 35 T 80 18 T 100 12" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3" />
                  </svg>
                  <span className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-indigo-600 shadow-sm">Target Bulan Ini: Terlampaui</span>
                </div>
              </div>

              {/* Top Selling packages list */}
              <div className="lg:col-span-4 glass-card p-8 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold mb-6 text-slate-800">Reservasi Terpopuler</h3>
                  <div className="space-y-4">
                    {packages.slice(0, 3).map((pkg, i) => (
                      <div key={pkg.id} className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 block text-sm">{pkg.name}</span>
                          <span className="text-xs text-slate-400">{pkg.duration}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${i === 0 ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"}`}>
                          {pkg.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setActiveTab("packages")} className="w-full mt-6 py-3 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold text-slate-600 transition-all text-center border border-slate-200">Kelola Seluruh Paket</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Packages */}
        {activeTab === "packages" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Daftar Paket Wisata di Database</span>
              <button
                onClick={() => handleOpenAdd("packages")}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 cursor-pointer"
              >
                + Buat Paket Wisata
              </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider bg-white/30">
                    <th className="p-6">Nama Paket</th>
                    <th className="p-6">Durasi</th>
                    <th className="p-6">Harga Per Pax</th>
                    <th className="p-6 text-center">Status</th>
                    <th className="p-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-6 font-bold text-slate-800 text-sm">{pkg.name}</td>
                      <td className="p-6 text-slate-500 text-sm">{pkg.duration}</td>
                      <td className="p-6 text-sm text-indigo-600 font-mono font-bold">
                        {formatRupiah(pkg.price)}
                      </td>
                      <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${pkg.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"}`}>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus("packages", pkg)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {pkg.status === "PUBLISHED" ? "Drafkan" : "Terbitkan"}
                        </button>
                        <button
                          onClick={() => handleOpenEdit("packages", pkg)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDelete("packages", pkg.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Articles */}
        {activeTab === "articles" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Daftar Blog Perjalanan</span>
              <button
                onClick={() => handleOpenAdd("articles")}
                className="gradient-btn px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
              >
                + Tulis Artikel Baru
              </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider bg-white/30">
                    <th className="p-6">Judul Artikel</th>
                    <th className="p-6 text-center">Status</th>
                    <th className="p-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map((post) => (
                    <tr key={post.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-6 max-w-sm">
                        <span className="font-bold text-slate-800 text-sm block truncate">{post.title}</span>
                        <span className="text-xs text-slate-400 block truncate mt-1">{post.slug}</span>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus("articles", post)}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {post.status === "PUBLISHED" ? "Drafkan" : "Terbitkan"}
                        </button>
                        <button
                          onClick={() => handleOpenEdit("articles", post)}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDelete("articles", post.id)}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Bookings */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <span className="text-slate-500 text-sm block">Data Reservasi Pengunjung {company?.name || "EO Situ Cileunca"}</span>
            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider bg-white/30">
                    <th className="p-6">Kode & Nama Tamu</th>
                    <th className="p-6">Jadwal & Paket</th>
                    <th className="p-6">Harga Total</th>
                    <th className="p-6 text-center">Bukti</th>
                    <th className="p-6 text-center">Status</th>
                    <th className="p-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-6">
                        <span className="font-mono font-bold text-indigo-600 text-xs block mb-1">{b.bookingCode}</span>
                        <span className="font-bold text-slate-800 text-sm block leading-tight">{b.customerName}</span>
                        {b.namaPemesan2 && <span className="text-xs text-slate-400 block">{b.namaPemesan2}</span>}
                        <span className="text-xs text-slate-400 block mt-1">{b.customerPhone} | {b.customerEmail}</span>
                      </td>
                      <td className="p-6">
                        <span className="font-bold text-slate-800 text-sm block mb-1">{b.packageName}</span>
                        <span className="text-xs text-slate-400 block">{b.bookingDate} | {b.totalGuests} Pax</span>
                      </td>
                      <td className="p-6 font-mono font-bold text-slate-800 text-sm">{formatRupiah(b.totalPrice)}</td>
                      <td className="p-6 text-center">
                        {b.paymentProof ? (
                          <a href={b.paymentProof} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Lihat
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-6 text-center">
                        <select
                          value={b.status}
                          onChange={(e) => handleBookingStatusChange(b.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-bold focus:outline-none border border-transparent cursor-pointer ${
                            b.status === "selesai" ? "bg-emerald-50 text-emerald-600" :
                            b.status === "dibatalkan" ? "bg-red-50 text-red-600" :
                            b.status === "proses" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          <option value="booking">Booking</option>
                          <option value="proses">Proses</option>
                          <option value="selesai">Selesai</option>
                          <option value="dibatalkan">Dibatalkan</option>
                        </select>
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDelete("bookings", b.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Company Profile */}
        {activeTab === "company" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Konfigurasi Identitas & Informasi Perusahaan</span>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveConfig("company", company); }} className="space-y-8 glass-card p-8 rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Informasi Identitas</h3>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Perusahaan</label>
                    <input type="text" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} required className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tagline / Slogan</label>
                    <input type="text" value={company.tagline} onChange={(e) => setCompany({ ...company, tagline: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Umum</label>
                    <textarea value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} rows={4} required className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:border-indigo-500 outline-none transition-all resize-none" />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Kontak & Lokasi</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                      <input type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} required className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Telepon</label>
                      <input type="text" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} required className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">WhatsApp Number</label>
                    <input type="text" value={company.whatsapp} onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })} placeholder="e.g. 62812345678" className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Alamat Kantor</label>
                    <textarea value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} rows={2} required className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Google Maps Embed/URL</label>
                    <input type="text" value={company.mapsUrl} onChange={(e) => setCompany({ ...company, mapsUrl: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Visi, Misi & Sejarah</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Visi Perusahaan</label>
                    <textarea value={company.vision} onChange={(e) => setCompany({ ...company, vision: e.target.value })} rows={4} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Misi Perusahaan</label>
                    <textarea value={company.mission} onChange={(e) => setCompany({ ...company, mission: e.target.value })} rows={4} placeholder="Gunakan baris baru untuk setiap poin misi..." className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm resize-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sejarah Singkat (History)</label>
                  <textarea value={company.history} onChange={(e) => setCompany({ ...company, history: e.target.value })} rows={6} className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm resize-none" />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 text-right">
                <button type="submit" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all text-sm uppercase tracking-widest">
                  Simpan Profil Perusahaan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab: Gallery */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Kelola Koleksi Foto Petualangan</span>
              <button onClick={() => handleOpenAdd("gallery")} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-md cursor-pointer">+ Tambah Foto Galeri</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((img) => (
                <div key={img.id} className="group relative glass-card rounded-3xl overflow-hidden aspect-square border border-slate-200">
                  <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">{img.category}</span>
                    <h4 className="text-white font-bold text-sm leading-tight mb-4">{img.title}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit("gallery", img)} className="flex-1 py-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white text-[10px] font-bold rounded-xl transition-colors">Ubah</button>
                      <button onClick={() => handleDelete("gallery", img.id)} className="flex-1 py-2 bg-red-500/60 hover:bg-red-50 text-white text-[10px] font-bold rounded-xl transition-colors">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {gallery.length === 0 && (
              <div className="py-20 text-center glass-card rounded-3xl border border-dashed border-slate-300">
                <span className="text-slate-400 text-sm">Belum ada koleksi foto. Mulai unggah momen petualangan Anda!</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Landing Editor */}
        {activeTab === "landing" && (
          <div className="space-y-8">
            {/* Sub Tabs Panel */}
            <div className="flex border-b border-slate-200 gap-1 flex-wrap">
              {(["hero", "about", "features", "testimonials", "team", "cta", "quotes"] as const).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveLandingSubTab(sub)}
                  className={`px-6 py-3 font-semibold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeLandingSubTab === sub ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-800"
                  }`}
                >
                  {sub === "hero" && "Hero Section"}
                  {sub === "about" && "Tentang Kami"}
                  {sub === "features" && "Keunggulan"}
                  {sub === "testimonials" && "Testimoni"}
                  {sub === "team" && "Tim Profesional"}
                  {sub === "cta" && "Siap Petualangan"}
                  {sub === "quotes" && "Kata Kata Hari Ini"}
                </button>
              ))}
            </div>

            {/* Sub Tab Content 1: Hero Section */}
            {activeLandingSubTab === "hero" && (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveConfig("hero", hero); }} className="glass-card p-8 rounded-3xl space-y-6 w-full">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Edit Hero Banner</h3>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Judul Hero Utama</label>
                  <input type="text" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sub-judul Deskripsi</label>
                  <textarea value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Teks Tombol</label>
                    <input type="text" value={hero.buttonText} onChange={(e) => setHero({ ...hero, buttonText: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <ImageUpload label="URL Gambar Latar" value={hero.imageUrl || ""} onChange={(url) => setHero({ ...hero, imageUrl: url })} section="hero-section" />
                  </div>
                </div>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md">Simpan Hero Banner</button>
              </form>
            )}

            {/* Sub Tab Content 2: About Us */}
            {activeLandingSubTab === "about" && (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveConfig("about", about); }} className="glass-card p-8 rounded-3xl space-y-6 w-full">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Edit Kisah Tentang Kami</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Judul Utama</label>
                    <input type="text" value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sub-judul Tagline</label>
                    <input type="text" value={about.subtitle} onChange={(e) => setAbout({ ...about, subtitle: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Lengkap Cerita</label>
                  <textarea value={about.description} onChange={(e) => setAbout({ ...about, description: e.target.value })} required rows={5} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm resize-none" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Statistik Wisatawan</label>
                    <input type="text" value={about.statsGuests} onChange={(e) => setAbout({ ...about, statsGuests: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Statistik Destinasi</label>
                    <input type="text" value={about.statsDestinations} onChange={(e) => setAbout({ ...about, statsDestinations: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Statistik Guides</label>
                    <input type="text" value={about.statsGuides} onChange={(e) => setAbout({ ...about, statsGuides: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                  </div>
                </div>
                <div>
                  <ImageUpload label="URL Gambar Utama" value={about.imageUrl || ""} onChange={(url) => setAbout({ ...about, imageUrl: url })} section="about-section" />
                </div>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md">Simpan Tentang Kami</button>
              </form>
            )}

            {/* Sub Tab Content 3: Features */}
            {activeLandingSubTab === "features" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Poin Keunggulan (Why Choose Us)</span>
                  <button onClick={() => handleOpenAdd("features")} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer">+ Tambah Keunggulan</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {features.map((f) => (
                    <div key={f.id} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mb-4 border border-indigo-100 uppercase">{f.icon}</div>
                        <h4 className="font-bold text-slate-800 text-base mb-2">{f.title}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed">{f.description}</p>
                      </div>
                      <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                        <button onClick={() => handleOpenEdit("features", f)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[10px] font-bold rounded-lg transition-colors cursor-pointer">Ubah</button>
                        <button onClick={() => handleDelete("features", f.id)} className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 text-[10px] font-bold rounded-lg transition-colors cursor-pointer">Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Tab Content 4: Testimonials */}
            {activeLandingSubTab === "testimonials" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Testimoni Ulasan Pelanggan</span>
                  <button onClick={() => handleOpenAdd("testimonials")} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer">+ Tambah Testimoni</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex items-center gap-1 mb-3 text-amber-500 font-bold text-xs">★ {t.rating} / 5</div>
                        <p className="text-slate-500 text-xs italic leading-relaxed">"{t.review}"</p>
                      </div>
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                            <img src={t.imageUrl || "/testi/default.jpg"} alt={t.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-xs block leading-tight">{t.name}</span>
                            <span className="text-[10px] text-slate-400 block">{t.role}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenEdit("testimonials", t)} className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer">Ubah</button>
                          <button onClick={() => handleDelete("testimonials", t.id)} className="px-2.5 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 text-[10px] font-bold rounded-lg cursor-pointer">Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Tab Content 5: Team Members */}
            {activeLandingSubTab === "team" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Staf Ahli & Tim Profesional</span>
                  <button onClick={() => handleOpenAdd("team")} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer">+ Tambah Tim</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {team.map((m) => (
                    <div key={m.id} className="bg-white border border-slate-200 p-6 rounded-2xl text-center shadow-sm flex flex-col justify-between items-center">
                      <div>
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 mx-auto mb-4 bg-slate-100">
                          <img src={m.imageUrl || "/team/default.jpg"} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm block leading-tight">{m.name}</span>
                        <span className="text-xs text-indigo-600 font-semibold block mt-1">{m.role}</span>
                        {m.instagramUrl && <span className="text-[10px] text-slate-400 block mt-2 font-mono truncate">{m.instagramUrl}</span>}
                      </div>
                      <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100 w-full justify-center">
                        <button onClick={() => handleOpenEdit("team", m)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[10px] font-bold rounded-lg cursor-pointer">Ubah</button>
                        <button onClick={() => handleDelete("team", m.id)} className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 text-[10px] font-bold rounded-lg cursor-pointer">Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Tab Content 6: CTA Bottom */}
            {activeLandingSubTab === "quotes" && (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveConfig("quotes", quotes); }} className="glass-card p-8 rounded-3xl space-y-6 w-full">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Edit Kata Kata Hari Ini</h3>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kata Kata Hari Ini</label>
                  <textarea value={quotes.title} onChange={(e) => setQuotes({ ...quotes, title: e.target.value })} required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm resize-none" placeholder="Masukkan kata-kata inspiratif hari ini..." />
                </div>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md">Simpan Kata Kata Hari Ini</button>
              </form>
            )}

            {/* Sub Tab Content 7: CTA Bottom */}
            {activeLandingSubTab === "cta" && (
              <form onSubmit={(e) => { e.preventDefault(); handleSaveConfig("cta", cta); }} className="glass-card p-8 rounded-3xl space-y-6 w-full">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Edit Footer Call To Action</h3>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Judul Banner CTA</label>
                  <input type="text" value={cta.title} onChange={(e) => setCta({ ...cta, title: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sub-judul Keterangan</label>
                  <textarea value={cta.subtitle} onChange={(e) => setCta({ ...cta, subtitle: e.target.value })} required rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Teks Tombol</label>
                    <input type="text" value={cta.buttonText} onChange={(e) => setCta({ ...cta, buttonText: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">URL WhatsApp Link / Button</label>
                    <input type="text" value={cta.buttonUrl} onChange={(e) => setCta({ ...cta, buttonUrl: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 text-sm" />
                  </div>
                </div>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md">Simpan CTA Banner</button>
              </form>
            )}
          </div>
        )}

        {/* Tab 6: Admin Accounts */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Akun Administrator Terdaftar</span>
              <button
                onClick={() => handleOpenAdd("users")}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-md shadow-indigo-500/10 cursor-pointer"
              >
                + Tambah Akun Admin
              </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider bg-white/30">
                    <th className="p-6">Nama Pengguna</th>
                    <th className="p-6">Username</th>
                    <th className="p-6">Peran / Role</th>
                    <th className="p-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((usr) => (
                    <tr key={usr.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-6 font-bold text-slate-800 text-sm">{usr.name}</td>
                      <td className="p-6 text-slate-500 font-mono text-xs">{usr.username}</td>
                      <td className="p-6">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${usr.role === "SUPERADMIN" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"}`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit("users", usr)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                        >
                          Ubah
                        </button>
                        <button
                          onClick={() => handleDelete("users", usr.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 7: SEO & Branding */}
        {activeTab === "seo" && (
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl space-y-10">
              {/* 1. Basic SEO Section */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Konfigurasi Dasar SEO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Meta Title Utama</label>
                      <input type="text" value={seo.title || ""} onChange={(e) => setSeo({ ...seo, title: e.target.value })} placeholder={`${company?.name || "EO Situ Cileunca"} - Jelajahi Keindahan Alam`} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:border-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Meta Keywords (Koma)</label>
                      <input type="text" value={seo.keywords || ""} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} placeholder="travel, liburan, bali, raja ampat" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:border-indigo-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Meta Description</label>
                    <textarea value={seo.description || ""} onChange={(e) => setSeo({ ...seo, description: e.target.value })} rows={5} placeholder="Deskripsi singkat website untuk hasil pencarian Google..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:border-indigo-500 outline-none resize-none" />
                  </div>
                </div>
              </section>

              {/* 2. Branding Section */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Aset Branding (Logo & Favicon)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <ImageUpload label="Logo Utama Website" value={seo.logoUrl || ""} onChange={(url) => setSeo({ ...seo, logoUrl: url })} section="branding" />
                  <ImageUpload label="Favicon (Ikon Tab Browser)" value={seo.faviconUrl || ""} onChange={(url) => setSeo({ ...seo, faviconUrl: url })} section="branding" />
                </div>
              </section>

              {/* 3. Social Media Sharing Section */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Social Media Sharing (Open Graph)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">OG Title (Judul Sosmed)</label>
                      <input type="text" value={seo.ogTitle || ""} onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">OG Description (Deskripsi Sosmed)</label>
                      <textarea value={seo.ogDescription || ""} onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Twitter Card Style</label>
                      <select value={seo.twitterCard || ""} onChange={(e) => setSeo({ ...seo, twitterCard: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm">
                        <option value="summary">Summary (Gambar Kecil)</option>
                        <option value="summary_large_image">Summary Large Image (Gambar Besar)</option>
                      </select>
                    </div>
                  </div>
                  <ImageUpload label="OG Image (Gambar Preview Share)" value={seo.ogImage || ""} onChange={(url) => setSeo({ ...seo, ogImage: url })} section="seo-og" />
                </div>
              </section>

              {/* 4. Technical SEO Section */}
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Pengaturan Teknis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Canonical URL (URL Utama)</label>
                    <input type="text" value={seo.canonicalUrl || ""} onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })} placeholder="https://iotravel.id" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Robots Instruction</label>
                    <input type="text" value={seo.robots || ""} onChange={(e) => setSeo({ ...seo, robots: e.target.value })} placeholder="index, follow" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                  </div>
                </div>
              </section>

              <div className="pt-6 border-t border-slate-100">
                <button
                  onClick={() => handleSaveConfig("meta", seo)}
                  className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all text-sm uppercase tracking-widest"
                >
                  Simpan Seluruh Metadata SEO
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Unified CRUD Add / Edit Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-xl w-full relative shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                <span>{editItem ? "Ubah" : "Tambah"} {modalType === "packages" ? "Paket Wisata" : modalType === "articles" ? "Artikel Blog" : modalType === "users" ? "Akun Admin" : modalType === "team" ? "Tim" : modalType === "testimonials" ? "Testimoni" : "Keunggulan"}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Packages Form fields */}
              {modalType === "packages" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Paket Wisata</label>
                    <input type="text" value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Harga (Rupiah)</label>
                      <input type="number" value={pkgForm.price} onChange={(e) => setPkgForm({ ...pkgForm, price: parseInt(e.target.value) || 0 })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Durasi (Hari & Malam)</label>
                      <input type="text" value={pkgForm.duration} onChange={(e) => setPkgForm({ ...pkgForm, duration: e.target.value })} required placeholder="e.g. 4 Hari 3 Malam" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Paket</label>
                    <textarea value={pkgForm.description} onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ImageUpload label="URL Gambar Utama" value={pkgForm.imageUrl || ""} onChange={(url) => setPkgForm({ ...pkgForm, imageUrl: url })} section="packages" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kategori</label>
                      <select value={pkgForm.category} onChange={(e) => setPkgForm({ ...pkgForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm">
                        <option value="wisata">Wisata</option>
                        <option value="villa">Villa</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status Visibilitas</label>
                      <select value={pkgForm.status} onChange={(e) => setPkgForm({ ...pkgForm, status: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm">
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Articles Form fields */}
              {modalType === "articles" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Judul Artikel</label>
                    <input type="text" value={artForm.title} onChange={(e) => setArtForm({ ...artForm, title: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Isi Konten Artikel</label>
                    <textarea value={artForm.content} onChange={(e) => setArtForm({ ...artForm, content: e.target.value })} required rows={8} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ImageUpload label="URL Gambar Sampul" value={artForm.imageUrl || ""} onChange={(url) => setArtForm({ ...artForm, imageUrl: url })} section="articles" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status Publikasi</label>
                      <select value={artForm.status} onChange={(e) => setArtForm({ ...artForm, status: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm">
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Team Form fields */}
              {modalType === "team" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
                      <input type="text" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jabatan / Peran</label>
                      <input type="text" value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                  </div>
                  <div>
                    <ImageUpload label="URL Foto Avatar" value={teamForm.imageUrl || ""} onChange={(url) => setTeamForm({ ...teamForm, imageUrl: url })} section="team" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Link Profil Instagram</label>
                    <input type="text" value={teamForm.instagramUrl} onChange={(e) => setTeamForm({ ...teamForm, instagramUrl: e.target.value })} placeholder="e.g. https://instagram.com/username" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                  </div>
                </>
              )}

              {/* Testimonials Form fields */}
              {modalType === "testimonials" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Ulas</label>
                      <input type="text" value={testForm.name} onChange={(e) => setTestForm({ ...testForm, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pekerjaan / Lokasi</label>
                      <input type="text" value={testForm.role} onChange={(e) => setTestForm({ ...testForm, role: e.target.value })} required placeholder="e.g. Solo Traveler" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Isi Review / Komentar</label>
                    <textarea value={testForm.review} onChange={(e) => setTestForm({ ...testForm, review: e.target.value })} required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rating Bintang (1 - 5)</label>
                      <input type="number" min="1" max="5" value={testForm.rating} onChange={(e) => setTestForm({ ...testForm, rating: parseInt(e.target.value) || 5 })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                    <div>
                      <ImageUpload label="URL Foto Avatar" value={testForm.imageUrl || ""} onChange={(url) => setTestForm({ ...testForm, imageUrl: url })} section="testimonials" />
                    </div>
                  </div>
                </>
              )}

              {/* Features Form fields */}
              {modalType === "features" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Judul Poin Keunggulan</label>
                      <input type="text" value={featForm.title} onChange={(e) => setFeatForm({ ...featForm, title: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gaya Icon SVG / Class</label>
                      <select value={featForm.icon} onChange={(e) => setFeatForm({ ...featForm, icon: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm">
                        <option value="compass">Compass (Kompas Petualang)</option>
                        <option value="users">Users (Pemandu Profesional)</option>
                        <option value="shield">Shield (Keamanan Terjamin)</option>
                        <option value="support">Support (Layanan 24/7)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Penjelasan Poin</label>
                    <textarea value={featForm.description} onChange={(e) => setFeatForm({ ...featForm, description: e.target.value })} required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm resize-none" />
                  </div>
                </>
              )}

              {/* Gallery Form fields */}
              {modalType === "gallery" && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Keterangan / Judul Foto</label>
                    <input type="text" value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} required placeholder="e.g. Keindahan Pantai Kelingking" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <ImageUpload label="URL Foto Galeri" value={galleryForm.imageUrl || ""} onChange={(url) => setGalleryForm({ ...galleryForm, imageUrl: url })} section="gallery" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kategori Foto</label>
                      <select value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm">
                        <option value="TOUR">TOUR (Wisata)</option>
                        <option value="TEAM">TEAM (Kegiatan Tim)</option>
                        <option value="GENERAL">GENERAL (Umum)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Users Form fields */}
              {modalType === "users" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Akun Lengkap</label>
                      <input type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Peran Akun (Role)</label>
                      <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm">
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPERADMIN">SUPERADMIN</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Username Login</label>
                      <input type="text" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{editItem ? "Password Baru (Opsional)" : "Password Login"}</label>
                      <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required={!editItem} placeholder={editItem ? "Kosongkan jika tidak diubah" : "••••••••"} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm" />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-teal-500 hover:shadow-lg hover:shadow-indigo-500/25 text-white font-bold rounded-xl text-center text-sm cursor-pointer"
              >
                Simpan & Sinkronisasi Database
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        open={!!deleteConfirm}
        title="Hapus Data"
        message="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
