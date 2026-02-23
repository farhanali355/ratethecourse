'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
)

const SUPER_ADMIN_EMAILS = ['admin@gmail.com', 'fariian@gmail.com', 'admin@ratemycourse.com']

export async function deleteUser(userId: string) {
    try {
        // Check if user is super admin
        const { data: userProfile } = await supabaseAdmin
            .from('profiles')
            .select('email')
            .eq('id', userId)
            .single()

        if (userProfile && SUPER_ADMIN_EMAILS.includes(userProfile.email?.toLowerCase())) {
            return { error: 'Cannot delete a Super Admin user.' }
        }

        // 1. Delete from auth.users (this usually cascades to profiles if set up, but we can be explicit if needed)
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (authError) {
            console.error('Auth delete error:', authError)
            return { error: authError.message }
        }

        // 2. Explicitly delete from profiles if no cascade (safe to try)
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', userId)

        if (profileError) {
            console.error('Profile delete error:', profileError)
            // We continue appropriately as auth delete is the main one
        }

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function updateUserRole(userId: string, newRole: 'student' | 'coach' | 'admin') {
    try {
        const { error } = await supabaseAdmin
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId)

        if (error) throw error

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteCourse(courseId: string) {
    try {
        // 1. Delete related reviews first to avoid foreign key constraint violations
        const { error: reviewsError } = await supabaseAdmin
            .from('reviews')
            .delete()
            .eq('course_id', courseId)

        if (reviewsError) {
            console.error('Error deleting reviews:', reviewsError)
            // We might want to stop here, or continue if you want to force delete
            return { error: `Failed to delete related reviews: ${reviewsError.message}` }
        }

        // 2. Delete the course submission
        const { error } = await supabaseAdmin
            .from('course_submissions')
            .delete()
            .eq('id', courseId)

        if (error) throw error

        revalidatePath('/admin/courses')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function createAdminUser(userData: { email: string; password: string; fullName: string; avatarUrl: string }) {
    try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
            user_metadata: {
                full_name: userData.fullName,
                avatar_url: userData.avatarUrl,
                role: 'admin'
            }
        })

        if (authError) {
            console.error('Auth create error:', authError)
            return { error: authError.message }
        }

        if (!authData.user) {
            return { error: 'Failed to create user object' }
        }

        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: authData.user.id,
                email: userData.email,
                full_name: userData.fullName,
                avatar_url: userData.avatarUrl,
                role: 'admin',
                created_at: new Date().toISOString()
            })

        if (profileError) {
            console.error('Profile create error:', profileError)
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
            return { error: 'Failed to create admin profile: ' + profileError.message }
        }

        revalidatePath('/admin/settings/admins')
        return { success: true, userId: authData.user.id }
    } catch (error: any) {
        console.error('Create admin exception:', error)
        return { error: error.message }
    }
}
