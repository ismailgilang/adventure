export async function uploadImage(file: File, section: string) {
  let cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  let uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // Jika variabel hardcoded (build-time) kosong, coba ambil dari API (runtime)
  // Ini penting untuk Cloudflare karena NEXT_PUBLIC_ sering tidak masuk ke bundle browser
  if (!cloudName || !uploadPreset) {
    try {
      const res = await fetch('/api/config');
      const config = await res.json();
      cloudName = config.cloudName;
      uploadPreset = config.uploadPreset;
    } catch (err) {
      console.error("Gagal mengambil runtime config:", err);
    }
  }

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary Configuration Missing:", {
      cloudName: !!cloudName,
      uploadPreset: !!uploadPreset
    });
    throw new Error(`Cloudinary configuration is missing in .env (${!cloudName ? 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ' : ''}${!uploadPreset ? 'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET' : ''})`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  
  // Format nama folder sesuai section, contoh: adventure/hero-section
  formData.append("folder", `adventure/${section}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to upload image");
  }

  const data = await response.json();
  
  // Mengembalikan URL gambar yang sudah di-upload
  return data.secure_url;
}
