// Alternative: Simpler script without TypeScript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    console.log('\n📝 Create a .env file with:');
    console.log('VITE_SUPABASE_URL=your-supabase-url');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    process.exit(1);
}

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
                email_confirm: true,
                user_metadata: {
                    role: account.role,
                    name: account.name,
                },
            });

            if (error) {
                if (error.message.includes('already registered')) {
                    console.log(`⚠️  ${account.email} already exists - skipping`);
                } else {
                    console.error(`❌ Failed to create ${account.email}:`, error.message);
                }
            } else {
                console.log(`✅ Created ${account.role.toUpperCase()}: ${account.email}`);
                console.log(`   Password: ${account.password}`);
                console.log(`   Role: ${account.role}`);
                console.log('');
            }
        } catch (err) {
            console.error(`❌ Error creating ${account.email}:`, err.message);
        }
    }

    console.log('\n✨ Done!\n');
    console.log('📝 Demo Accounts:');
    console.log('┌─────────────────────────┬───────────┬────────┐');
    console.log('│ Email                   │ Password  │ Role   │');
    console.log('├─────────────────────────┼───────────┼────────┤');
    console.log('│ admin@kulinerku.com     │ admin123  │ Admin  │');
    console.log('│ user@kulinerku.com      │ user123   │ Member │');
    console.log('└─────────────────────────┴───────────┴────────┘');
    console.log('\n🌐 Login at: http://192.168.1.100:8080/login\n');
}

createDemoAccounts().then(() => process.exit(0));
