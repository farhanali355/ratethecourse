const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
    if (!fs.existsSync(envPath)) {
        console.log('ERROR: .env.local file NOT FOUND.');
        process.exit(1);
    }

    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');

    console.log('--- .env.local Analysis ---');
    console.log('File size:', content.length, 'bytes');

    const keysToCheck = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'RESEND_API_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
    ];

    keysToCheck.forEach(key => {
        const line = lines.find(l => l.startsWith(key + '='));
        if (line) {
            const value = line.split('=')[1] || '';
            const cleanedValue = value.trim().replace(/^["']|["']$/g, '');
            console.log(`[OK] ${key}: Present (Length: ${cleanedValue.length})`);
            if (cleanedValue.length < 10) {
                console.log(`     WARNING: ${key} seems suspiciously short.`);
            }
        } else {
            console.log(`[MISSING] ${key}: NOT FOUND`);
        }
    });
    console.log('---------------------------');

} catch (err) {
    console.error('Error reading file:', err);
}
