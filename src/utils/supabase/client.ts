import { createBrowserClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined
let memoizedIsUpdatePasswordPage: boolean | undefined

export function createClient() {
    const isUpdatePasswordPage = typeof window !== 'undefined' && window.location.pathname === '/update-password'

    // If a client already exists AND it matches our current page context, return it
    if (client && memoizedIsUpdatePasswordPage === isUpdatePasswordPage) {
        return client
    }

    // Otherwise (re)create it
    memoizedIsUpdatePasswordPage = isUpdatePasswordPage

    client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                persistSession: !isUpdatePasswordPage,
                detectSessionInUrl: !isUpdatePasswordPage,
                autoRefreshToken: !isUpdatePasswordPage,
            }
        }
    )

    // Extra safety: If we are on the update page, manually clear any session that might have leaked
    if (isUpdatePasswordPage) {
        client.auth.signOut().catch(() => { });
    }

    return client
}
