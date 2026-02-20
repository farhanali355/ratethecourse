require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('--- Testing Supabase Admin Access ---');
console.log('URL:', supabaseUrl);
console.log('Key Length:', serviceRoleKey ? serviceRoleKey.length : 'MISSING');

if (!supabaseUrl || !serviceRoleKey) {
    console.error('ERROR: Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function testAdmin() {
    try {
        console.log('Attempting to list users (Admin only)...');
        const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });

        if (error) {
            console.error('FAILED:', error.message);
            console.error('This means the SUPABASE_SERVICE_ROLE_KEY is invalid or lacks permissions.');
            if (error.message.includes('Bearer token')) {
                console.error('HINT: You likely pasted the ANON KEY instead of the SERVICE ROLE KEY.');
            }
        } else {
            console.log('SUCCESS: Retrieved users list.');
            console.log('The Service Role Key is VALID.');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testAdmin();
