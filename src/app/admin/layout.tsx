import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { ThemeProvider } from '@/components/admin/ThemeContext'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // 1. Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login')
    }

    // 2. Check Admin Authorization
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single()

    const isSuperAdmin = user.email === 'admin@gmail.com'
    const hasAdminAccess = profile && (profile.role === 'admin' || profile.is_admin)

    // Strictly block if not admin AND not the Superadmin
    if (!isSuperAdmin && !hasAdminAccess) {
        redirect('/')
    }

    return (
        <ThemeProvider>
            <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#050B14] font-montserrat transition-colors duration-300">
                <AdminSidebar />
                <main className="flex-1 flex flex-col">
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </ThemeProvider>
    )
}
