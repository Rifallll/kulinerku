"use client";

// URL gambar placeholder lokal jika tidak ada gambar atau gambar rusak
const NO_IMAGE_PLACEHOLDER = "/no-image-available.svg"; // Menggunakan path relatif ke folder public
const ERROR_IMAGE_PLACEHOLDER = "/image-load-error.svg"; // Menggunakan path relatif ke folder public

/**
 * Memeriksa URL gambar dan mengembalikan URL yang valid atau placeholder.
 * @param foodName Nama makanan (digunakan untuk placeholder jika diperlukan).
 * @param originalUrl URL gambar asli.
 * @returns URL gambar yang diperbaiki atau URL placeholder.
 */
export const fixImageUrl = (foodName: string, originalUrl: string): string => {
  // Periksa apakah URL asli kosong atau null
  if (!originalUrl || originalUrl.trim() === "") {
    return NO_IMAGE_PLACEHOLDER;
  }

  // Fix malformed placeholder URLs (missing base domain)
  // If URL starts with dimensions like "400x300?text=" it's missing the base URL
  if (/^\d+x\d+\?text=/.test(originalUrl)) {
    // Extract the text parameter
    const textMatch = originalUrl.match(/text=([^&]+)/);
    const text = textMatch ? decodeURIComponent(textMatch[1]) : foodName;
    // Use placehold.co as a reliable alternative
    return `https://placehold.co/400x300/e2e8f0/334155?text=${encodeURIComponent(text)}`;
  }

  // Replace via.placeholder.com with placehold.co (more reliable)
  if (originalUrl.includes("via.placeholder.com")) {
    const textMatch = originalUrl.match(/text=([^&]+)/);
    const text = textMatch ? decodeURIComponent(textMatch[1]) : foodName;
    return `https://placehold.co/400x300/e2e8f0/334155?text=${encodeURIComponent(text)}`;
  }

  // If URL contains "no-image", use local placeholder
  if (originalUrl.includes("no-image")) {
    return NO_IMAGE_PLACEHOLDER;
  }

  return originalUrl;
};

/**
 * URL gambar placeholder untuk digunakan saat gambar gagal dimuat.
 */
export const getErrorImagePlaceholder = (): string => {
  return ERROR_IMAGE_PLACEHOLDER;
};