'use server'

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Resend } from 'resend';


export async function signupWithResend(formData: FormData) {
    console.log('--- Debugging Environment Variables ---');
    console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length || 0);
    console.log('SUPABASE_URL present:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SERVICE_ROLE_KEY present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('---------------------------------------');

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error('RESEND_API_KEY is missing');
        return { error: 'System configuration error: Email service not configured.' };
    }
    const resend = new Resend(resendApiKey);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const role = formData.get('role') as string;

    // Use standard supabase-js client for Admin/Service Role operations
    // This bypasses cookie handling which is unnecessary and potentially problematic for admin tasks
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    try {
        // 1. Create the user and get the verification link/token
        const { data, error } = await supabase.auth.admin.generateLink({
            type: 'signup',
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    role: role
                }
            }
        });

        if (error) {
            console.error('Supabase Generate Link Error:', error);
            return { error: error.message };
        }

        const token = data.properties?.email_otp;

        if (!token) {
            return { error: 'Failed to generate verification token' };
        }

        // 2. Send the email using Resend
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'Rate My Course <onboarding@resend.dev>', // Update this with your verified domain if available
            to: email, // works with 'delivered@resend.dev' for testing without domain
            subject: 'Verify your Rate My Course account',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome to Rate My Course!</h2>
                    <p>Please use the following 6-digit code to verify your email address:</p>
                    <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px;">${token}</h1>
                    <p>If you didn't create an account, you can ignore this email.</p>
                </div>
            `
        });

        if (emailError) {
            console.error('Resend Email Error:', emailError);
            return { error: 'Failed to send verification email. Please try again.' };
        }

        return { success: true };

    } catch (err: unknown) {
        console.error('Signup Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        return { error: errorMessage };
    }
}
