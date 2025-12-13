import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const foodOrigins = [
    { name: "Rendang", origin: "Sumatera Barat" },
    { name: "Nasi Goreng", origin: "Nasional" },
    { name: "Rawon", origin: "Jawa Timur" },
    { name: "Pempek", origin: "Sumatera Selatan (Palembang)" },
    { name: "Sate", origin: "Jawa" },
    { name: "Soto", origin: "Nasional" },
    { name: "Bakso", origin: "Jawa Tengah" },
    { name: "Gado-gado", origin: "Jakarta" },
    { name: "Ayam Goreng", origin: "Jawa" },
    { name: "Ikan Bakar", origin: "Sulawesi" },
    { name: "Soto Betawi", origin: "Jakarta" },
    { name: "Soto Lamongan", origin: "Jawa Timur" },
    { name: "Soto Medan", origin: "Sumatera Utara" },
    { name: "Soto Makassar", origin: "Sulawesi Selatan" },
    { name: "Coto Makassar", origin: "Sulawesi Selatan" },
    { name: "Sup Buntut", origin: "Jakarta" },
    { name: "Rawon Setan", origin: "Jawa Timur" },
    { name: "Sop Iga", origin: "Jawa Tengah" },
    { name: "Babi Kecap", origin: "Bali" },
    { name: "Pallubasa", origin: "Sulawesi Selatan" },
    { name: "Nasi Padang", origin: "Sumatera Barat" },
    { name: "Nasi Uduk", origin: "Jakarta" },
    { name: "Nasi Kuning", origin: "Sulawesi" },
    { name: "Nasi Liwet", origin: "Solo, Jawa Tengah" },
    { name: "Nasi Pecel", origin: "Madiun, Jawa Timur" },
    { name: "Lontong Sayur", origin: "Sumatera" },
    { name: "Ketupat", origin: "Jawa" },
    { name: "Lontong Opor", origin: "Jawa Tengah" },
    { name: "Nasi Gandul", origin: "Pati, Jawa Tengah" },
    { name: "Nasi Kucing", origin: "Yogyakarta" },
    { name: "Ayam Bakar", origin: "Jawa" },
    { name: "Ayam Taliwang", origin: "Lombok, NTB" },
    { name: "Bebek Goreng", origin: "Madura, Jawa Timur" },
    { name: "Iga Bakar", origin: "Jawa Barat" },
    { name: "Rendang Ayam", origin: "Sumatera Barat" },
    { name: "Gulai Kambing", origin: "Sumatera" },
    { name: "Gulai Ikan", origin: "Sumatera" },
    { name: "Dendeng Balado", origin: "Sumatera Barat" },
    { name: "Semur Daging", origin: "Jawa" },
    { name: "Sate Padang", origin: "Sumatera Barat" },
    { name: "Siomay", origin: "Bandung, Jawa Barat" },
    { name: "Batagor", origin: "Bandung, Jawa Barat" },
    { name: "Martabak Manis", origin: "Bangka" },
    { name: "Martabak Telur", origin: "India–Indonesia" },
    { name: "Pempek Kapal Selam", origin: "Palembang, Sumatera Selatan" },
    { name: "Lumpia", origin: "Semarang, Jawa Tengah" },
    { name: "Otak-otak", origin: "Kepulauan Riau" },
    { name: "Tahu Gejrot", origin: "Cirebon, Jawa Barat" },
    { name: "Tempe Mendoan", origin: "Banyumas, Jawa Tengah" },
    { name: "Pisang Goreng", origin: "Nasional" }
];

export const updateFoodOrigins = async () => {
    let count = 0;
    let errors = 0;

    toast.info("Updating food origins...");

    for (const item of foodOrigins) {
        try {
            // Update by name (assuming names match)
            const { error } = await supabase
                .from('food_items')
                .update({ origin: item.origin })
                .ilike('name', item.name); // Using ilike for case-insensitive match

            if (error) {
                console.error(`Failed to update ${item.name}:`, error);
                errors++;
            } else {
                count++;
            }
        } catch (err) {
            console.error(`Error updating ${item.name}:`, err);
            errors++;
        }
    }

    if (errors === 0) {
        toast.success(`Successfully updated origins for ${count} items!`);
    } else {
        toast.warning(`Updated ${count} items, but encountered ${errors} errors.`);
    }
};
