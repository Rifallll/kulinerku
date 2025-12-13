import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

// Template deskripsi bahasa Indonesia untuk berbagai jenis makanan
const generateIndonesianDescription = (name, type, origin) => {
    const descriptions = {
        'Makanan': [
            `${name} adalah hidangan khas ${origin} yang terkenal dengan cita rasa autentiknya. Makanan ini diolah dengan bumbu rempah pilihan dan teknik memasak tradisional yang diwariskan turun-temurun.`,
            `Hidangan ${name} dari ${origin} memiliki kelezatan yang khas dengan perpaduan bumbu yang sempurna. Setiap gigitan memberikan pengalaman kuliner yang tak terlupakan.`,
            `${name} merupakan salah satu kuliner ikonik ${origin} yang wajib dicoba. Diracik dengan bahan-bahan berkualitas dan bumbu tradisional yang kaya rempah.`
        ],
        'Minuman': [
            `${name} adalah minuman tradisional khas ${origin} yang menyegarkan. Minuman ini dibuat dengan resep turun-temurun yang memadukan bahan alami pilihan.`,
            `Minuman ${name} dari ${origin} terkenal dengan rasa yang unik dan menyegarkan. Cocok dinikmati dalam segala suasana.`,
            `${name} merupakan minuman khas ${origin} yang memiliki cita rasa istimewa. Terbuat dari bahan-bahan alami yang berkhasiat.`
        ],
        'Jajanan & Makanan Ringan': [
            `${name} adalah camilan khas ${origin} yang renyah dan gurih. Jajanan ini sangat populer sebagai teman santai atau oleh-oleh.`,
            `Jajanan ${name} dari ${origin} memiliki tekstur yang khas dan rasa yang menggugah selera. Sempurna untuk menemani waktu santai.`
        ],
        'Sup & Soto': [
            `${name} adalah sup/soto khas ${origin} dengan kuah yang gurih dan kaya rempah. Hidangan berkuah ini hangat dan menenangkan.`,
            `Soto ${name} dari ${origin} terkenal dengan kuah yang sedap dan isian yang melimpah. Cocok dinikmati kapan saja.`
        ],
        'Hidangan Nasi': [
            `${name} adalah hidangan nasi khas ${origin} yang lengkap dan mengenyangkan. Nasi diracik dengan bumbu spesial dan lauk pilihan.`,
            `Nasi ${name} dari ${origin} merupakan hidangan komplit dengan cita rasa yang istimewa.`
        ],
        'Sate': [
            `${name} adalah sate khas ${origin} dengan bumbu yang meresap sempurna. Daging dipanggang hingga matang dan dilumuri bumbu kacang/kecap yang lezat.`,
            `Sate ${name} dari ${origin} terkenal dengan kelezatan dagingnya yang empuk dan bumbu yang khas.`
        ]
    };

    // Pilih kategori yang sesuai atau default
    const category = descriptions[type] || descriptions['Makanan'];

    // Pilih deskripsi secara random untuk variasi
    const randomDesc = category[Math.floor(Math.random() * category.length)];

    return randomDesc;
};

async function updateAllDescriptions() {
    console.log('🔄 Updating all food descriptions to Indonesian...\n');

    try {
        // Fetch all food items
        const { data: foods, error } = await supabase
            .from('food_items')
            .select('*');

        if (error) {
            console.error('Error fetching foods:', error);
            return;
        }

        console.log(`Found ${foods.length} food items to update\n`);

        let updated = 0;
        let skipped = 0;

        for (const food of foods) {
            // Generate new Indonesian description
            const newDesc = generateIndonesianDescription(
                food.name,
                food.type || 'Makanan',
                food.origin || 'Indonesia'
            );

            // Update in database
            const { error: updateError } = await supabase
                .from('food_items')
                .update({ description: newDesc })
                .eq('id', food.id);

            if (updateError) {
                console.error(`❌ Error updating ${food.name}:`, updateError);
                skipped++;
            } else {
                console.log(`✅ Updated: ${food.name}`);
                updated++;
            }

            // Small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Updated: ${updated}`);
        console.log(`   Skipped: ${skipped}`);
        console.log(`   Total: ${foods.length}`);

    } catch (error) {
        console.error('\n❌ Failed:', error.message);
        throw error;
    }
}

updateAllDescriptions()
    .then(() => {
        console.log('\n✅ All descriptions updated to Indonesian!');
        console.log('🔄 Refresh your browser to see changes.');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
