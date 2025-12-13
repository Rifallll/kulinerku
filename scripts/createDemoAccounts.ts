import { createClient } from '@supabase/supabase-js';

// Import dari .env atau config Anda
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

// Use service role key untuk bypass email confirmation
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

const demoAccounts = [
    {
        email: 'admin@kulinerku.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin Kulinerku',
    },
    {
        email: 'user@kulinerku.com',
        password: 'user123',
        role: 'member',
        name: 'User Member',
    },
];

async function createDemoAccounts() {
    console.log('🚀 Creating demo accounts...\n');

    for (const account of demoAccounts) {
        try {
            const { data, error } = await supabase.auth.admin.createUser({
                email: account.email,
                password: account.password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    role: account.role,
                    name: account.name,
                },
            });

            if (error) {
                console.error(`❌ Failed to create ${account.email}:`, error.message);
            } else {
                console.log(`✅ Created ${account.role.toUpperCase()}: ${account.email}`);
                console.log(`   Password: ${account.password}`);
                console.log(`   Role: ${account.role}`);
                console.log('');
            }
        } catch (err) {
            console.error(`❌ Error creating ${account.email}:`, err);
        }
    }

    console.log('✨ Done! You can now login with these accounts.\n');
    console.log('📝 Demo Accounts:');
    console.log('   Admin: admin@kulinerku.com / admin123');
    console.log('   Member: user@kulinerku.com / user123');
}

createDemoAccounts();
