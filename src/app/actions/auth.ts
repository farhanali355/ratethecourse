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

export async function resetPasswordWithResend(email: string, origin: string) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        return { error: 'System configuration error: Email service not configured.' };
    }
    const resend = new Resend(resendApiKey);

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
        // Ensure origin is clean and has a protocol
        const cleanOrigin = origin.replace(/\/$/, "");
        const redirectUrl = cleanOrigin.startsWith('http')
            ? `${cleanOrigin}/update-password`
            : `https://${cleanOrigin}/update-password`;

        const { data, error } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
                redirectTo: redirectUrl
            }
        });

        if (error) {
            console.error('Supabase Generate Recovery Link Error:', error);
            return { error: error.message };
        }

        const resetLink = data.properties?.action_link;

        if (!resetLink) {
            return { error: 'Failed to generate reset link' };
        }

        const { error: emailError } = await resend.emails.send({
            from: 'Rate My Course <onboarding@resend.dev>',
            to: email,
            subject: 'Reset your password - Rate My Course',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password. Click the button below to proceed:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #0088EE; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; font-size: 12px; color: #666;">${resetLink}</p>
                    <p>If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
            `
        });

        if (emailError) {
            console.error('Resend Reset Email Error:', emailError);
            return { error: emailError.message || 'Failed to send reset email. Please try again.' };
        }

        return { success: true };

    } catch (err: unknown) {
        console.error('Reset Password Action Error:', err);
        return { error: 'An unexpected error occurred' };
    }
}

export async function updateUserPassword(password: string, tokens: { access_token: string, refresh_token: string }) {
    // 1. Create a SERVICE ROLE client for admin operations
    // This is much more reliable as it doesn't depend on session state or cookies
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
        // 2. Identify the user from the access token
        // Use the standard client logic to verify the user first
        const { data: { user }, error: userError } = await supabase.auth.getUser(tokens.access_token);

        if (userError || !user) {
            console.error('Verify token error:', userError);
            return { error: 'Your reset session is invalid or has expired. Please request a new link.' };
        }

        // 3. Update the user password via Auth Admin API
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: password }
        );

        if (updateError) {
            console.error('Admin password update error:', updateError);
            return { error: updateError.message };
        }

        return { success: true };
    } catch (err: unknown) {
        console.error('Server Password Update Error:', err);
        return { error: 'An unexpected server error occurred. Please try again.' };
    }
}
