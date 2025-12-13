// Comprehensive Indonesian Food Ingredients Database with Measurements
// Format: "takaran bahan" for proper recipe display

const FOOD_INGREDIENTS: Record<string, string[]> = {
    // === SATE ===
    "Sate Maranggi": [
        "500 gram daging sapi has dalam",
        "3 sdm kecap manis",
        "2 sdm minyak goreng",
        "5 siung bawang putih, haluskan",
        "3 cm jahe, parut",
        "1 sdt merica bubuk",
        "1 sdt garam",
        "50 ml air asam jawa"
    ],
    "Sate Ayam": [
        "500 gram daging ayam paha",
        "4 sdm kecap manis",
        "2 sdm minyak goreng",
        "4 siung bawang putih, haluskan",
        "1 sdt ketumbar bubuk",
        "1/2 sdt garam",
        "100 gram kacang tanah goreng",
        "3 buah cabai merah keriting",
        "2 sdm air jeruk limau"
    ],
    "Sate Padang": [
        "500 gram daging sapi",
        "200 gram lidah sapi",
        "5 sdm tepung beras",
        "3 batang serai, memarkan",
        "5 lembar daun jeruk",
        "3 cm lengkuas, memarkan",
        "10 buah cabai merah kering",
        "5 siung bawang merah",
        "3 siung bawang putih",
        "2 cm kunyit",
        "1 sdt garam",
        "500 ml santan encer"
    ],
    "Sate Lilit": [
        "500 gram ikan tenggiri, haluskan",
        "100 gram kelapa parut",
        "3 lembar daun jeruk, iris halus",
        "2 batang serai, iris halus",
        "5 siung bawang merah",
        "3 siung bawang putih",
        "5 buah cabai rawit",
        "1 sdt garam",
        "1/2 sdt merica"
    ],

    // === RENDANG & GULAI ===
    "Rendang": [
        "1 kg daging sapi has dalam",
        "1 liter santan kental",
        "10 buah cabai merah besar",
        "15 siung bawang merah",
        "8 siung bawang putih",
        "5 cm jahe",
        "5 cm lengkuas",
        "3 batang serai",
        "5 lembar daun jeruk",
        "2 lembar daun kunyit",
        "1 sdm ketumbar bubuk",
        "1 sdt jintan",
        "2 sdt garam"
    ],
    "Gulai Ayam": [
        "1 ekor ayam kampung, potong 12",
        "500 ml santan kental",
        "300 ml santan encer",
        "8 buah cabai merah besar",
        "10 siung bawang merah",
        "5 siung bawang putih",
        "3 cm kunyit",
        "3 cm jahe",
        "3 cm lengkuas",
        "3 batang serai",
        "5 lembar daun jeruk",
        "2 lembar daun salam",
        "1 sdt garam"
    ],
    "Opor Ayam": [
        "1 ekor ayam, potong 8",
        "750 ml santan",
        "3 lembar daun salam",
        "3 cm lengkuas, memarkan",
        "2 batang serai, memarkan",
        "10 siung bawang merah",
        "5 siung bawang putih",
        "5 butir kemiri",
        "2 cm jahe",
        "1 sdt ketumbar",
        "1/2 sdt jintan",
        "1 sdt garam"
    ],

    // === NASI ===
    "Nasi Goreng": [
        "400 gram nasi putih dingin",
        "2 butir telur",
        "100 gram ayam suwir",
        "3 siung bawang putih, cincang",
        "5 siung bawang merah, iris",
        "3 buah cabai rawit",
        "2 sdm kecap manis",
        "1 sdm saus tiram",
        "1/2 sdt garam",
        "2 sdm minyak goreng",
        "Daun bawang secukupnya"
    ],
    "Nasi Uduk": [
        "500 gram beras",
        "400 ml santan",
        "2 lembar daun salam",
        "2 batang serai, memarkan",
        "2 cm lengkuas",
        "1 sdt garam",
        "Bawang goreng secukupnya"
    ],
    "Nasi Kuning": [
        "500 gram beras",
        "400 ml santan",
        "3 cm kunyit, parut",
        "2 lembar daun salam",
        "2 batang serai",
        "2 cm lengkuas",
        "1 sdt garam"
    ],

    // === SOTO & SUP ===
    "Soto Ayam": [
        "1 ekor ayam kampung",
        "2 liter air",
        "3 cm jahe, memarkan",
        "3 cm kunyit",
        "5 cm lengkuas",
        "3 batang serai",
        "5 lembar daun jeruk",
        "10 siung bawang merah",
        "5 siung bawang putih",
        "5 butir kemiri",
        "1 sdt ketumbar",
        "1 sdt garam",
        "100 gram soun, rendam",
        "3 butir telur rebus",
        "200 gram tauge"
    ],
    "Soto Betawi": [
        "500 gram daging sapi",
        "250 gram jeroan sapi",
        "500 ml santan",
        "500 ml susu cair",
        "3 cm jahe",
        "3 cm lengkuas",
        "2 batang serai",
        "3 lembar daun jeruk",
        "1 batang daun bawang",
        "8 siung bawang merah",
        "4 siung bawang putih",
        "3 butir kemiri",
        "1 sdt merica",
        "1 sdt garam"
    ],
    "Rawon": [
        "500 gram daging sapi sandung lamur",
        "100 gram kluwek",
        "10 siung bawang merah",
        "6 siung bawang putih",
        "5 butir kemiri",
        "3 cm lengkuas",
        "3 cm kunyit",
        "3 cm jahe",
        "2 batang serai",
        "5 lembar daun jeruk",
        "2 liter air",
        "1 sdt garam",
        "200 gram tauge"
    ],

    // === GORENGAN ===
    "Ayam Goreng": [
        "1 ekor ayam, potong 8",
        "3 cm lengkuas, memarkan",
        "3 lembar daun salam",
        "2 batang serai",
        "8 siung bawang merah",
        "5 siung bawang putih",
        "2 cm kunyit",
        "1 sdt ketumbar",
        "500 ml air",
        "1 sdt garam",
        "Minyak goreng secukupnya"
    ],
    "Tempe Goreng": [
        "300 gram tempe, iris",
        "3 siung bawang putih, haluskan",
        "1/2 sdt ketumbar bubuk",
        "1/4 sdt garam",
        "50 ml air",
        "Minyak goreng secukupnya"
    ],
    "Tahu Goreng": [
        "10 buah tahu putih",
        "3 siung bawang putih, haluskan",
        "1/2 sdt garam",
        "Minyak goreng secukupnya"
    ],
    "Perkedel Kentang": [
        "500 gram kentang, kukus",
        "100 gram daging giling",
        "2 butir telur",
        "3 siung bawang putih, haluskan",
        "5 siung bawang merah, iris",
        "1/4 sdt pala bubuk",
        "1/2 sdt merica",
        "1 sdt garam",
        "Daun bawang, iris",
        "Minyak goreng secukupnya"
    ],
    "Bakwan Sayur": [
        "100 gram tepung terigu",
        "50 gram tepung beras",
        "150 ml air",
        "100 gram kol, iris halus",
        "50 gram wortel, serut",
        "50 gram tauge",
        "2 batang daun bawang, iris",
        "3 siung bawang putih, haluskan",
        "1/2 sdt garam",
        "Minyak goreng secukupnya"
    ],

    // === SAYURAN ===
    "Sayur Lodeh": [
        "200 gram labu siam, potong dadu",
        "100 gram kacang panjang",
        "100 gram terong",
        "50 gram tahu, potong dadu",
        "500 ml santan",
        "3 lembar daun salam",
        "2 cm lengkuas",
        "5 siung bawang merah",
        "3 siung bawang putih",
        "3 buah cabai merah",
        "1 sdt garam",
        "1/2 sdt gula merah"
    ],
    "Sayur Asem": [
        "100 gram kacang tanah",
        "100 gram jagung manis",
        "100 gram labu siam",
        "50 gram kacang panjang",
        "50 gram melinjo",
        "3 buah asam jawa",
        "5 siung bawang merah",
        "2 siung bawang putih",
        "3 buah cabai merah",
        "1 cm lengkuas",
        "1 sdt garam",
        "1 sdm gula merah",
        "1 liter air"
    ],
    "Gado-Gado": [
        "200 gram kacang tanah goreng",
        "5 buah cabai rawit",
        "3 siung bawang putih",
        "2 sdm gula merah",
        "2 sdm air asam jawa",
        "200 ml air matang",
        "1 sdt garam",
        "200 gram tauge, rebus",
        "200 gram kol, iris",
        "100 gram tahu goreng",
        "100 gram tempe goreng",
        "2 buah kentang rebus",
        "2 butir telur rebus"
    ],
    "Pecel": [
        "200 gram kacang tanah goreng",
        "5 buah cabai rawit",
        "2 siung bawang putih",
        "3 lembar daun jeruk",
        "2 sdm gula merah",
        "1 sdm asam jawa",
        "1 sdt garam",
        "200 gram kangkung, rebus",
        "200 gram tauge, rebus",
        "100 gram kacang panjang, rebus"
    ],

    // === SAMBAL ===
    "Sambal Terasi": [
        "10 buah cabai rawit",
        "5 buah cabai merah besar",
        "1 sdt terasi bakar",
        "3 siung bawang merah",
        "1 siung bawang putih",
        "1 buah tomat",
        "1/2 sdt garam",
        "1/2 sdt gula"
    ],
    "Sambal Matah": [
        "10 siung bawang merah, iris tipis",
        "5 buah cabai rawit, iris",
        "3 batang serai, iris halus",
        "5 lembar daun jeruk, buang tulang, iris",
        "1 sdt terasi goreng",
        "1/2 sdt garam",
        "3 sdm minyak kelapa panas"
    ],

    // === BAKSO & MIE ===
    "Bakso": [
        "300 gram daging sapi giling",
        "100 gram tepung tapioka",
        "3 siung bawang putih, haluskan",
        "1 butir putih telur",
        "1/2 sdt merica bubuk",
        "1 sdt garam",
        "50 ml air es",
        "1 liter kaldu sapi"
    ],
    "Mie Goreng": [
        "200 gram mie telur",
        "100 gram ayam, potong dadu",
        "2 butir telur",
        "50 gram sawi hijau",
        "3 siung bawang putih, cincang",
        "5 siung bawang merah, iris",
        "2 sdm kecap manis",
        "1 sdm saus tiram",
        "1/2 sdt garam",
        "2 sdm minyak goreng"
    ],

    // === TONGSENG & TENGKLENG ===
    "Tongseng Kambing": [
        "500 gram daging kambing",
        "200 gram kol, potong",
        "3 buah tomat, potong",
        "5 buah cabai merah besar",
        "10 siung bawang merah",
        "5 siung bawang putih",
        "3 cm jahe",
        "3 cm lengkuas",
        "2 batang serai",
        "3 lembar daun jeruk",
        "3 sdm kecap manis",
        "500 ml air",
        "1 sdt garam"
    ],

    // === DESSERT ===
    "Es Cendol": [
        "100 gram tepung beras",
        "50 gram tepung hunkwe",
        "1/2 sdt pasta pandan",
        "400 ml air",
        "200 ml santan kental",
        "150 gram gula merah, serut",
        "100 ml air untuk gula",
        "Es batu secukupnya"
    ],
    "Klepon": [
        "250 gram tepung ketan",
        "1/2 sdt pasta pandan",
        "150 ml air hangat",
        "100 gram gula merah, serut",
        "100 gram kelapa parut",
        "1/4 sdt garam"
    ],
    "Onde-Onde": [
        "200 gram tepung ketan",
        "50 gram gula pasir",
        "100 ml air hangat",
        "100 gram pasta kacang hijau",
        "100 gram wijen putih",
        "Minyak goreng secukupnya"
    ]
};

export default FOOD_INGREDIENTS;
