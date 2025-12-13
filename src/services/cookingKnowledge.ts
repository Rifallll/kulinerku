// Smart AI Chef - Comprehensive Indonesian Cooking Knowledge Base
// Works offline without API

interface KnowledgeEntry {
    keywords: string[];
    answer: string;
}

// Extensive cooking knowledge database
const COOKING_KNOWLEDGE: KnowledgeEntry[] = [
    // Greetings
    { keywords: ["halo", "hai", "hi", "hello", "siapa"], answer: "Halo! Saya AI Chef, asisten masak Indonesia. Saya bisa membantu Anda dengan tips memasak, resep, substitusi bahan, dan teknik masak tradisional Indonesia. Tanyakan apa saja!" },

    // Common questions
    { keywords: ["apa itu", "apakah", "jelaskan", "definisi"], answer: "Saya bisa menjelaskan berbagai masakan Indonesia! Sebutkan nama masakannya dan saya akan jelaskan." },

    // === COOKING TIPS ===
    { keywords: ["gosong", "hangus", "terbakar"], answer: "Agar tidak gosong: 1) Gunakan api kecil-sedang, 2) Aduk secara teratur, 3) Tambahkan sedikit air jika mulai kering, 4) Jangan tinggalkan masakan tanpa pengawasan, 5) Gunakan wajan anti lengket untuk pemula." },

    { keywords: ["empuk", "lembut", "tender"], answer: "Agar daging empuk: 1) Potong melawan serat, 2) Marinasi dengan nanas/pepaya parut 30 menit, 3) Masak dengan api kecil dan lama, 4) Untuk rendang, masak minimal 2-3 jam, 5) Gunakan presto untuk lebih cepat." },

    { keywords: ["tidak amis", "hilangkan amis", "bau amis"], answer: "Hilangkan bau amis: 1) Lumuri dengan jeruk nipis/lemon, 2) Rendam dengan air jahe, 3) Gunakan kunyit saat marinasi, 4) Cuci dengan air garam, 5) Tambahkan daun salam saat memasak." },

    { keywords: ["gurih", "umami", "rasa dalam"], answer: "Agar lebih gurih: 1) Gunakan kaldu tulang homemade, 2) Tambahkan sedikit terasi/ebi, 3) Tumis bawang sampai kecoklatan, 4) Gunakan kecap ikan, 5) Masak bumbu sampai benar-benar matang." },

    { keywords: ["pedas", "cabai", "tidak terlalu pedas"], answer: "Atur kepedasan: 1) Buang biji cabai untuk pedas ringan, 2) Gunakan cabai merah besar (kurang pedas), 3) Tambahkan gula/santan untuk netralkan, 4) Cabai rawit = sangat pedas, cabai keriting = sedang, cabai besar = ringan." },

    { keywords: ["asin", "keasinan", "terlalu asin"], answer: "Jika terlalu asin: 1) Tambahkan air/santan, 2) Masukkan kentang mentah (serap garam), 3) Tambahkan gula sedikit, 4) Perbanyak nasi saat makan, 5) Untuk kuah, encerkan dengan air." },

    { keywords: ["santan pecah", "santan tidak pecah"], answer: "Agar santan tidak pecah: 1) Aduk terus saat memasak, 2) Gunakan api kecil-sedang, 3) Jangan ditutup, 4) Masukkan santan di akhir, 5) Aduk searah jarum jam." },

    // === SUBSTITUSI BAHAN ===
    { keywords: ["ganti santan", "pengganti santan", "tidak ada santan"], answer: "Pengganti santan: 1) Susu evaporasi + sedikit minyak kelapa, 2) Krim kental + air, 3) Susu almond, 4) Santan bubuk + air, 5) Untuk diet: susu skim (rasa berbeda)." },

    { keywords: ["ganti kecap", "pengganti kecap", "tidak ada kecap"], answer: "Pengganti kecap manis: Campur 2 sdm gula merah + 1 sdm kecap asin + sedikit air, lalu panaskan sampai mengental. Atau gunakan madu + kecap asin." },

    { keywords: ["ganti lengkuas", "pengganti lengkuas"], answer: "Pengganti lengkuas: 1) Jahe (rasa berbeda tapi mirip), 2) Bubuk lengkuas, 3) Sereh (aroma berbeda). Catatan: lengkuas memberikan rasa khas yang sulit diganti sempurna." },

    { keywords: ["ganti daun jeruk", "pengganti daun jeruk"], answer: "Pengganti daun jeruk: 1) Kulit jeruk nipis parut, 2) Kulit lemon, 3) Daun jeruk kering (stok), 4) Skip jika tidak ada (bumbu pelengkap). 1 lembar daun jeruk = 1/4 sdt kulit jeruk parut." },

    { keywords: ["ganti kemiri", "pengganti kemiri"], answer: "Pengganti kemiri: 1) Kacang macadamia (paling mirip), 2) Kacang mete, 3) Kacang almond blanched, 4) Kacang tanah (tekstur berbeda). Gunakan jumlah sama." },

    { keywords: ["ganti terasi", "pengganti terasi"], answer: "Pengganti terasi: 1) Pasta udang/shrimp paste, 2) Fish sauce + sedikit ebi, 3) Miso + ebi bubuk. Terasi memberikan umami khas yang sulit diganti sempurna." },

    // === TEKNIK MASAK ===
    { keywords: ["tumis", "cara tumis", "menumis"], answer: "Teknik tumis yang benar: 1) Panaskan minyak dulu dengan api sedang, 2) Masukkan bawang putih setelah minyak panas, 3) Aduk cepat 30 detik, 4) Masukkan bahan lain, 5) Tumis sampai harum dan berubah warna." },

    { keywords: ["goreng", "menggoreng", "cara goreng"], answer: "Tips menggoreng: 1) Minyak harus cukup panas (tes dengan sumpit - berbuih), 2) Jangan terlalu banyak sekaligus, 3) Keringkan bahan sebelum goreng, 4) Tiriskan di rak kawat bukan tisu, 5) Api sedang-besar." },

    { keywords: ["rebus", "merebus", "cara rebus"], answer: "Tips merebus: 1) Air harus mendidih dulu baru masukkan bahan, 2) Untuk kaldu: mulai dari air dingin, 3) Buang buih yang muncul, 4) Api kecil untuk kaldu yang jernih, 5) Jangan tutup rapat." },

    { keywords: ["kukus", "mengukus", "cara kukus"], answer: "Tips mengukus: 1) Air harus mendidih sebelum masukkan bahan, 2) Jangan terlalu banyak air (jangan sentuh wadah), 3) Tutup rapat, 4) Jangan buka-tutup sering, 5) Lapisi tutup dengan serbet untuk serap uap." },

    { keywords: ["panggang", "memanggang", "bakar"], answer: "Tips memanggang: 1) Panaskan grill/oven dulu, 2) Olesi minyak agar tidak lengket, 3) Bolak-balik sekali saja, 4) Jarak dari api sekitar 10-15cm, 5) Untuk sate: kipas agar bara merata." },

    // === BUMBU DASAR ===
    { keywords: ["bumbu dasar", "bumbu wajib", "bumbu penting"], answer: "Bumbu dasar Indonesia: 1) Bawang merah, bawang putih, 2) Cabai merah, cabai rawit, 3) Lengkuas, jahe, kunyit, 4) Serai, daun jeruk, daun salam, 5) Kemiri, ketumbar, 6) Santan, kecap manis, terasi. Ini fondasi hampir semua masakan." },

    { keywords: ["haluskan bumbu", "ulek", "blender"], answer: "Tips haluskan bumbu: 1) Ulek = tekstur kasar, lebih harum, 2) Blender = halus sempurna, praktis, 3) Tambahkan sedikit minyak/air saat blender, 4) Goreng bumbu sampai harum sebelum masak, 5) Bumbu matang = tidak berbau mentah." },

    // === MASAKAN SPESIFIK ===
    { keywords: ["rendang", "cara rendang"], answer: "Tips Rendang sempurna: 1) Gunakan daging has dalam, potong besar, 2) Masak 3-4 jam api kecil, 3) Aduk setiap 15 menit, 4) Santan harus kering sempurna, 5) Warna coklat kehitaman = matang, 6) Simpan 1 minggu di kulkas." },

    { keywords: ["sate", "cara sate"], answer: "Tips Sate enak: 1) Potong daging ukuran seragam, 2) Marinasi minimal 1 jam, 3) Rendam tusuk bambu dulu, 4) Bakar di bara bukan api, 5) Olesi bumbu saat membakar, 6) Kipas untuk bara merata." },

    { keywords: ["nasi goreng", "cara nasi goreng"], answer: "Tips Nasi Goreng: 1) Gunakan nasi dingin/semalam, 2) Api besar dan wajan panas, 3) Masak cepat 3-5 menit, 4) Kecap di akhir, 5) Telur diorak-arik dulu atau mata sapi, 6) Tambah sedikit mentega untuk aroma." },

    { keywords: ["sambal", "cara sambal"], answer: "Tips Sambal enak: 1) Goreng cabai dan bawang, 2) Ulek kasar lebih nikmat, 3) Tambah garam dan gula seimbang, 4) Terasi dibakar dulu, 5) Jeruk limau di akhir, 6) Simpan dalam jar tertutup di kulkas." },

    { keywords: ["soto", "cara soto"], answer: "Tips Soto: 1) Rebus ayam dengan air dingin, 2) Buang buih untuk kuah jernih, 3) Bumbu ditumis sampai harum, 4) Kunyit untuk warna kuning, 5) Sajikan dengan pelengkap lengkap, 6) Kuah panas saat disajikan." },

    { keywords: ["gulai", "cara gulai"], answer: "Tips Gulai: 1) Tumis bumbu halus sampai harum, 2) Masukkan santan encer dulu, 3) Didihkan baru masukkan daging, 4) Api kecil agar santan tidak pecah, 5) Santan kental di akhir, 6) Jangan ditutup saat memasak santan." },

    { keywords: ["opor", "cara opor"], answer: "Tips Opor Ayam: 1) Ayam tidak perlu digoreng dulu, 2) Santan yang kental, 3) Bumbu halus ditumis sampai harum, 4) Masak api kecil, 5) Cocok dengan ketupat/lontong, 6) Lebih enak kalau didiamkan semalam." },

    // === PENYIMPANAN ===
    { keywords: ["simpan", "awet", "tahan lama"], answer: "Tips menyimpan makanan: 1) Kulkas: 2-3 hari dalam wadah tertutup, 2) Freezer: 1-3 bulan, 3) Rendang kering tahan 1 minggu, 4) Sambal dalam jar tahan 2 minggu di kulkas, 5) Bumbu halus bisa dibekukan dalam es batu." },

    { keywords: ["panaskan", "reheat", "menghangatkan"], answer: "Tips memanaskan: 1) Microwave 2-3 menit, 2) Wajan: tambah sedikit air, tutup, api kecil, 3) Kukus untuk kue/nasi, 4) Jangan panaskan berulang lebih dari 2x, 5) Pastikan panas merata sebelum makan." },

    // === PORSI & TAKARAN ===
    { keywords: ["porsi", "untuk berapa orang", "takaran"], answer: "Panduan porsi: 1) 100-150g daging per orang, 2) 1 cangkir beras = 2-3 porsi nasi, 3) 500ml santan = 4-5 porsi gulai, 4) 1 ekor ayam = 4-6 porsi, 5) Kalikan resep sesuai kebutuhan, bumbu juga dikalikan." },

    // === ALAT MASAK ===
    { keywords: ["wajan", "panci", "alat masak"], answer: "Alat masak penting: 1) Wajan/teflon anti lengket, 2) Presto untuk empukkan daging, 3) Blender/cobek untuk bumbu, 4) Dandang untuk kukus, 5) Parutan kelapa, 6) Spatula kayu untuk tumis." },

    // === KEGAGALAN UMUM ===
    { keywords: ["gagal", "tidak jadi", "rusak"], answer: "Kegagalan umum dan solusi: 1) Santan pecah? Blender dan saring. 2) Terlalu asin? Tambah air/kentang. 3) Gosong? Pindah wadah, jangan kerok yang gosong. 4) Kurang rasa? Tambah garam/gula di akhir. 5) Daging alot? Masak lebih lama dengan api kecil." }
];

// Find best matching answer
function findBestAnswer(question: string, recipeName: string, ingredients: string[]): string {
    const q = question.toLowerCase();

    // Search in knowledge base
    let bestMatch: KnowledgeEntry | null = null;
    let maxScore = 0;

    for (const entry of COOKING_KNOWLEDGE) {
        let score = 0;
        for (const keyword of entry.keywords) {
            if (q.includes(keyword)) {
                score += keyword.length; // Longer matches = better
            }
        }
        if (score > maxScore) {
            maxScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch && maxScore > 0) {
        // Personalize with recipe name if relevant
        let answer = bestMatch.answer;
        if (recipeName && answer.includes("masakan")) {
            answer = answer.replace("masakan", recipeName);
        }
        return answer;
    }

    // Default intelligent response
    return `Untuk ${recipeName}, saya sarankan: 1) Gunakan bahan segar, 2) Ikuti urutan resep, 3) Jangan terburu-buru dengan bumbu, 4) Koreksi rasa di akhir. Ada pertanyaan spesifik lain? Coba tanyakan tentang tips memasak, bumbu, atau teknik tertentu!`;
}

export default findBestAnswer;
