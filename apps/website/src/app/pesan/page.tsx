"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/Skeleton";

interface BookingForm {
  nama: string;
  email: string;
  telepon: string;
  paket: string;
  tanggal: string;
  tamu: number;
}

export default function PesanPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [seo, setSeo] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<BookingForm>({
    nama: "",
    email: "",
    telepon: "",
    paket: "",
    tanggal: "",
    tamu: 1
  });

  const [bookingCode, setBookingCode] = useState("");
  const [showModal, setShowModal] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    setLoading(true);
    // Fetch data dinamis (SEO, Packages & Company)
    fetch("/api/landing")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.seo) setSeo(res.data.seo);
          if (res.data.company) setCompany(res.data.company);
          if (res.data.packages) {
            setDbPackages(res.data.packages);
            // Set default package if not set
            if (res.data.packages.length > 0) {
              setForm(prev => ({ ...prev, paket: res.data.packages[0].id }));
            }
          }
        }
      })
      .catch((err) => console.error("Gagal mengambil data landing:", err))
      .finally(() => setLoading(false));
  }, []);

  // Derived pricing information
  const pricing = useMemo(() => {
    const selectedPkg = dbPackages.find(p => p.id === form.paket);
    const base = selectedPkg ? selectedPkg.price : 0;
    const sub = base * form.tamu;
    const disc = Math.floor(sub * 0.1); // 10% automatic discount
    const tot = sub - disc;

    return {
      basePrice: base,
      subtotal: sub,
      discount: disc,
      total: tot
    };
  }, [form.paket, form.tamu, dbPackages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tamu" ? Math.max(1, parseInt(value) || 1) : value
    }));
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.email || !form.telepon || !form.tanggal || !form.paket) {
      alert("Harap lengkapi seluruh formulir pemesanan!");
      return;
    }

    const selectedPkg = dbPackages.find(p => p.id === form.paket);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          packageName: selectedPkg ? selectedPkg.name : form.paket,
          customerName: form.nama,
          customerEmail: form.email,
          customerPhone: form.telepon,
          bookingDate: form.tanggal,
          totalGuests: form.tamu,
          totalPrice: pricing.total
        })
      });

      const res = await response.json();
      if (res.success && res.data) {
        setBookingCode(res.data.bookingCode);
        setShowModal(true);
      } else {
        alert(res.message || "Gagal mengirimkan pemesanan. Silakan coba kembali.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.");
    }
  };

  const resetForm = () => {
    setForm({
      nama: "",
      email: "",
      telepon: "",
      paket: dbPackages.length > 0 ? dbPackages[0].id : "",
      tanggal: "",
      tamu: 1
    });
    setShowModal(false);
  };

  const brandName = company?.name || "IO Travel";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between">
      <Navbar navScrolled={true} seo={seo} company={company} toggleMenu={toggleMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Main Reservation Portal */}
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-100 border border-accent-200 text-accent-700 text-sm font-semibold mb-4">Portal Pemesanan</span>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Reservasi <span className="gradient-text">Petualangan Anda</span>
            </h1>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Lengkapi formulir pemesanan di bawah ini untuk mengamankan kursi Anda. Subtotal Anda dihitung secara instan.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
                <Skeleton className="h-8 w-64" />
                <div className="space-y-6">
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                  <Skeleton className="h-14 w-44 rounded-2xl" />
                  <Skeleton className="h-16 w-full rounded-2xl" />
                </div>
              </div>
              <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
                <Skeleton className="h-8 w-64" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <Skeleton className="h-[200px] w-full rounded-2xl" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Booking Form Card */}
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">1</span>
                  <span>Data Pemesan & Jadwal</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
                    <input type="text" name="nama" value={form.nama} onChange={handleChange} required placeholder="Masukkan nama lengkap sesuai identitas..." className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 transition-all"/>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alamat Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="contoh@domain.com" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 transition-all"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nomor Telepon (WhatsApp)</label>
                      <input type="tel" name="telepon" value={form.telepon} onChange={handleChange} required placeholder="0812xxxxxxxx" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-gray-900 transition-all"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Paket Destinasi</label>
                      <select name="paket" value={form.paket} onChange={handleChange} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 font-medium transition-all">
                        {dbPackages.length > 0 ? dbPackages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} ({pkg.duration})
                          </option>
                        )) : (
                          <>
                            <option value="ubud">Ubud Culture & Nature Escape (4D3N)</option>
                            <option value="raja_ampat">Raja Ampat Diving Expeditions (5D4N)</option>
                            <option value="labuan_bajo">Labuan Bajo Islands Explorer (4D3N)</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tanggal Keberangkatan</label>
                      <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} required className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Jumlah Tamu (Orang)</label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setForm((prev) => ({ ...prev, tamu: Math.max(1, prev.tamu - 1) }))} className="w-12 h-12 rounded-xl border border-gray-200 hover:border-primary-500 flex items-center justify-center font-bold text-lg text-gray-700 bg-white transition-colors">-</button>
                      <input type="number" name="tamu" value={form.tamu} onChange={handleChange} min="1" required className="w-16 h-12 border border-gray-200 rounded-xl text-center font-bold text-lg text-gray-900 bg-gray-50 focus:outline-none"/>
                      <button type="button" onClick={() => setForm((prev) => ({ ...prev, tamu: prev.tamu + 1 }))} className="w-12 h-12 rounded-xl border border-gray-200 hover:border-primary-500 flex items-center justify-center font-bold text-lg text-gray-700 bg-white transition-colors">+</button>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all text-center text-base">Konfirmasi & Pesan Sekarang</button>
                </form>
              </div>

              {/* Pricing Summary Sidepanel */}
              <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-28">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center text-sm font-bold">2</span>
                  <span>Rincian Pembayaran</span>
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Harga per pax</span>
                    <span className="font-semibold text-gray-900">{formatRupiah(pricing.basePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Jumlah tamu</span>
                    <span className="font-semibold text-gray-900">{form.tamu} Orang</span>
                  </div>
                  <hr className="border-gray-100"/>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatRupiah(pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                    <span>Diskon Promo Web (10%)</span>
                    <span>- {formatRupiah(pricing.discount)}</span>
                  </div>
                  <hr className="border-gray-100 my-2"/>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-gray-900 block">Total Pembayaran</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Sudah termasuk PPN & Asuransi</span>
                    </div>
                    <span className="text-2xl font-extrabold text-primary-600">{formatRupiah(pricing.total)}</span>
                  </div>
                </div>

                {/* Extra Perks Banner */}
                <div className="mt-8 p-5 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-500/10 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Garansi Layanan Refund</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Dapatkan refund 100% jika pembatalan dilakukan selambat-lambatnya 7 hari sebelum keberangkatan.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer seo={seo} cta={{}} company={company} />

      {/* Confetti Booking Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 opacity-100 transition-opacity">
          <div className="bg-white rounded-[40px] p-8 max-w-lg w-full text-center relative border border-gray-100 shadow-2xl overflow-hidden flex flex-col items-center">
            {/* SVG Confetti Simulation Background */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="80" r="8" fill="#D97A3A" />
                <rect x="150" y="40" width="12" height="12" fill="#E3B53A" transform="rotate(45 150 40)" />
                <polygon points="350,150 358,162 342,162" fill="#C96A2E" />
                <rect x="250" y="200" width="10" height="15" fill="#F0C64A" transform="rotate(30 250 200)" />
                <circle cx="80" cy="250" r="6" fill="#D97A3A" />
                <rect x="400" y="80" width="8" height="14" fill="#E3B53A" transform="rotate(15 400 80)" />
              </svg>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto text-4xl shadow-inner mb-2 animate-bounce">✓</div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">Pemesanan Sukses!</h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Selamat! Kursi perjalanan impian Anda telah diamankan. Simpan kode booking Anda untuk proses verifikasi:</p>
              
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 rounded-3xl p-6 relative">
                <span className="text-[10px] text-primary-400 font-bold uppercase tracking-widest block mb-2">Kode Booking Anda</span>
                <span className="text-3xl font-black text-primary-600 tracking-wider font-mono select-all">{bookingCode}</span>
              </div>

              <div className="text-xs text-gray-400/80 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                Pihak Admin {brandName} akan menghubungi Anda melalui email <b>{form.email}</b> atau WhatsApp <b>{form.telepon}</b> dalam waktu 1x24 jam untuk verifikasi pembayaran.
              </div>

              <button onClick={resetForm} className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-primary-600 text-white font-bold transition-all shadow-md">Tutup & Kembali</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
