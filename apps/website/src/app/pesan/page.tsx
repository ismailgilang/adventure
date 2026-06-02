"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import MobileMenu from "@/components/layout/MobileMenu";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/Skeleton";

export default function PesanPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dbPackages, setDbPackages] = useState<any[]>([]);
  const [seo, setSeo] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    namaPemesan: "",
    namaPemesan2: "",
    noWa: "",
    email: "",
    paketId: "",
    villaId: "",
    tanggal: "",
    jumlahPeserta: 1,
    totalHarga: 0,
  });

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    setLoading(true);
    fetch("/api/landing")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.seo) setSeo(res.data.seo);
          if (res.data.company) setCompany(res.data.company);
          if (res.data.packages) setDbPackages(res.data.packages);
        }
      })
      .catch((err) => console.error("Gagal mengambil data landing:", err))
      .finally(() => setLoading(false));
  }, []);

  const wisataPackages = dbPackages.filter((p) => p.category === "wisata");
  const villaPackages = dbPackages.filter((p) => p.category === "villa");

  const selectedPaket = wisataPackages.find((p) => p.id === form.paketId);
  const selectedVilla = villaPackages.find((p) => p.id === form.villaId);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleNext = () => {
    if (step === 2 && (!form.namaPemesan || !form.noWa || !form.email)) {
      toast.error("Harap isi semua field yang wajib diisi!");
      return;
    }
    if (step === 3 && (!form.paketId || !form.tanggal)) {
      toast.error("Harap pilih paket wisata dan tanggal!");
      return;
    }
    if (step === 3) {
      setForm((prev) => ({
        ...prev,
        totalHarga: (selectedPaket?.price || 0) * prev.jumlahPeserta + (selectedVilla?.price || 0),
      }));
    }
    setStep((s) => Math.min(s + 1, 4));
  };
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!paymentFile) {
      toast.error("Harap upload bukti pembayaran!");
      return;
    }

    setSubmitting(true);

    try {
      const selectedPaket = wisataPackages.find((p) => p.id === form.paketId);
      const selectedVilla = villaPackages.find((p) => p.id === form.villaId);
      const namaPaket = selectedPaket?.name || "";
      const namaVilla = selectedVilla?.name || "";

      // Upload bukti pembayaran ke Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append("file", paymentFile);
      uploadFormData.append("upload_preset", "adventure");
      uploadFormData.append("folder", "adventure/payment-proofs");

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/djsyrismk/image/upload`,
        { method: "POST", body: uploadFormData }
      );

      if (!uploadRes.ok) {
        toast.error("Gagal mengupload bukti pembayaran.");
        return;
      }

      const uploadData = await uploadRes.json();
      const paymentProofUrl = uploadData.secure_url;

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageName: namaPaket + (namaVilla ? ` + ${namaVilla}` : ""),
          customerName: form.namaPemesan,
          customerEmail: form.email,
          customerPhone: form.noWa,
          bookingDate: form.tanggal,
          totalGuests: form.jumlahPeserta,
          totalPrice: form.totalHarga,
          namaPemesan2: form.namaPemesan2 || null,
          packageId: form.paketId || null,
          villaId: form.villaId || null,
          paymentProof: paymentProofUrl,
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        const bc = res.data.bookingCode;
        const waNumber = company?.whatsapp?.replace(/[^0-9]/g, "") || "6281995451017";
        const waMessage = encodeURIComponent(
          `*Pemesanan Baru!*\n\n` +
          `*Kode Booking:* ${bc}\n` +
          `*Nama Pemesan:* ${form.namaPemesan}\n` +
          (form.namaPemesan2 ? `*Nama Pemesan 2:* ${form.namaPemesan2}\n` : "") +
          `*No WA:* ${form.noWa}\n` +
          `*Email:* ${form.email}\n` +
          `*Paket:* ${namaPaket}${namaVilla ? ` + ${namaVilla}` : ""}\n` +
          `*Tanggal:* ${form.tanggal}\n` +
          `*Jumlah Peserta:* ${form.jumlahPeserta}\n` +
          `*Total Harga:* Rp ${form.totalHarga.toLocaleString("id-ID")}\n\n` +
          `_Status: Booking_`
        );
        window.open(`https://wa.me/${waNumber}?text=${waMessage}`, "_blank");

        toast.success(`Pemesanan berhasil! Kode booking: ${bc}`);
        setForm({
          namaPemesan: "",
          namaPemesan2: "",
          noWa: "",
          email: "",
          paketId: "",
          villaId: "",
          tanggal: "",
          jumlahPeserta: 1,
          totalHarga: 0,
        });
        setPaymentFile(null);
        setStep(1);
      } else {
        toast.error(res.message || "Gagal mengirim pemesanan.");
      }
    } catch {
      toast.error("Terjadi kesalahan koneksi.");
    } finally {
      setSubmitting(false);
    }
  };

  const brandName = company?.name || "Villa Situ Cileunca";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar navScrolled={true} seo={seo} company={company} toggleMenu={toggleMenu} />
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />

      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-100 border border-accent-200 text-accent-700 text-sm font-semibold mb-4">Form Pemesanan</span>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Reservasi <span className="gradient-text">Petualangan Anda</span>
            </h1>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-400"
                }`}>{s}</div>
                {s < 4 && <div className={`w-10 h-1 rounded-full ${step > s ? "bg-primary-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-44 rounded-2xl" />
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
              {/* Step 1: Pemberitahuan */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-center text-gray-900">Perhatian!</h2>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                    <p className="text-gray-700 text-base leading-relaxed">
                      Sebelum melakukan pemesanan, sebaiknya hubungi admin terlebih dahulu untuk menanyakan
                      ketersediaan jadwal dan paket wisata agar tidak terjadi kesalahan.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5 text-center">
                    <p className="text-sm text-gray-500 mb-2">Hubungi Admin via WhatsApp:</p>
                    <a
                      href={`https://wa.me/${company?.whatsapp?.replace(/[^0-9]/g, "") || "6281995451017"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      Hubungi Admin
                    </a>
                  </div>
                  <button onClick={handleNext} className="w-full py-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors">
                    Lanjutkan Pemesanan
                  </button>
                </div>
              )}

              {/* Step 2: Data Diri */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Data Diri</h2>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nama Pemesan <span className="text-red-500">*</span></label>
                    <input type="text" value={form.namaPemesan} onChange={(e) => setForm({ ...form, namaPemesan: e.target.value })} required placeholder="Nama lengkap pemesan" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nama Pemesan Ke-2 (Opsional)</label>
                    <input type="text" value={form.namaPemesan2} onChange={(e) => setForm({ ...form, namaPemesan2: e.target.value })} placeholder="Nama lengkap pemesan kedua" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nomor WhatsApp <span className="text-red-500">*</span></label>
                    <input type="tel" value={form.noWa} onChange={(e) => setForm({ ...form, noWa: e.target.value })} required placeholder="0812xxxxxxxx" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email <span className="text-red-500">*</span></label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="contoh@domain.com" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handlePrev} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">Kembali</button>
                    <button onClick={handleNext} className="flex-1 py-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors">Selanjutnya</button>
                  </div>
                </div>
              )}

              {/* Step 3: Pemilihan Paket & Villa */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Pilih Paket & Jadwal</h2>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Paket Wisata <span className="text-red-500">*</span></label>
                    <select value={form.paketId} onChange={(e) => setForm({ ...form, paketId: e.target.value })} required className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all">
                      <option value="">-- Pilih Paket --</option>
                      {wisataPackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.duration}</option>
                      ))}
                    </select>
                    {selectedPaket && (
                      <div className="mt-4 bg-primary-50 border border-primary-200 rounded-2xl p-5 flex items-start gap-4">
                        {selectedPaket.imageUrl && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                            <img src={selectedPaket.imageUrl} alt={selectedPaket.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900">{selectedPaket.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{selectedPaket.duration}</p>
                          <p className="text-sm font-semibold text-primary-600 mt-1">{selectedPaket.price ? formatRupiah(selectedPaket.price) : ""}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Villa (Opsional)</label>
                    <select value={form.villaId} onChange={(e) => setForm({ ...form, villaId: e.target.value })} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all">
                      <option value="">-- Tidak Memilih Villa --</option>
                      {villaPackages.map((villa) => (
                        <option key={villa.id} value={villa.id}>{villa.name} - {villa.duration}</option>
                      ))}
                    </select>
                    {selectedVilla && (
                      <div className="mt-4 bg-accent-50 border border-accent-200 rounded-2xl p-5 flex items-start gap-4">
                        {selectedVilla.imageUrl && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                            <img src={selectedVilla.imageUrl} alt={selectedVilla.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900">{selectedVilla.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{selectedVilla.duration}</p>
                          <p className="text-sm font-semibold text-accent-600 mt-1">{selectedVilla.price ? formatRupiah(selectedVilla.price) : ""}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tanggal <span className="text-red-500">*</span></label>
                    <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Jumlah Peserta</label>
                    <input type="number" value={form.jumlahPeserta} onChange={(e) => setForm({ ...form, jumlahPeserta: Math.max(1, parseInt(e.target.value) || 1) })} min="1" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary-500 text-gray-900 transition-all" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handlePrev} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">Kembali</button>
                    <button onClick={handleNext} className="flex-1 py-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors">Selanjutnya</button>
                  </div>
                </div>
              )}

              {/* Step 4: Total Harga & Pembayaran */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Total Harga & Pembayaran</h2>

                  {/* Info Rekening */}
                  <div className="bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200 rounded-2xl p-6 space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Transfer Pembayaran
                    </h3>
                    <div className="bg-white rounded-xl p-4 border border-primary-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">BCA</p>
                      <p className="text-sm font-semibold text-gray-900">M. AJI ABDURAHMAN</p>
                      <p className="text-lg font-black text-primary-600 tracking-wider mt-1">233-099-0417</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Total Harga</span>
                        <span className="font-bold text-gray-900">{formatRupiah(form.totalHarga)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">DP 5%</span>
                        <span className="font-bold text-primary-600">{formatRupiah(Math.round(form.totalHarga * 0.05))}</span>
                      </div>
                      <hr className="border-amber-200" />
                      <p className="text-xs leading-relaxed">
                        Sisa pembayaran bisa dilakukan setelah outbond. Jika DP telah masuk dan customer batal order, maka DP tidak bisa dikembalikan.
                      </p>
                    </div>
                  </div>

                  {/* Upload Bukti Pembayaran */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upload Bukti Pembayaran <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer" onClick={() => document.getElementById("payment-upload")?.click()}>
                      {paymentFile ? (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{paymentFile.name}</p>
                          <p className="text-xs text-gray-400">{(paymentFile.size / 1024).toFixed(1)} KB</p>
                          <button onClick={(e) => { e.stopPropagation(); setPaymentFile(null); }} className="text-xs text-red-500 hover:text-red-700 font-semibold">Hapus</button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-600">Klik untuk upload bukti transfer</p>
                          <p className="text-xs text-gray-400">Format: JPG, PNG, maks 2MB</p>
                        </div>
                      )}
                      <input id="payment-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setPaymentFile(e.target.files?.[0] || null)} />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={handlePrev} disabled={submitting} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Kembali</button>
                    <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {submitting && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}
                      {submitting ? "Mengirim..." : "Kirim Pemesanan"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer seo={seo} cta={{}} company={company} packages={dbPackages} />
    </div>
  );
}
