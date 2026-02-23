
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const role = searchParams.get('role')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // If a specific role was requested (e.g. from Signup or Login UI), 
            // only apply it if the user is new or currently set as a basic 'student'
            if (role) {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single()

                    if (!profile || (profile.role === 'student' && role === 'coach')) {
                        await supabase.auth.updateUser({
                            data: { role }
                        })
                    }
                }
            }

            // Final redirection check for Admin
            const { data: { user } } = await supabase.auth.getUser()
            const isAdmin = user?.user_metadata?.role === 'admin' || user?.email === 'admin@gmail.com'

            const redirectPath = isAdmin ? '/admin' : next
            return NextResponse.redirect(`${origin}${redirectPath}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
