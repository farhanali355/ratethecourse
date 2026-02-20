-- =====================================================
-- FIX ADMIN DELETION RPC FUNCTION
-- =====================================================
-- This script updates the delete_admin_properly function
-- to use the new superadmin email: admin@gmail.com
-- instead of farhan@gmail.com
-- =====================================================

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS delete_admin_properly(uuid);

-- Create the updated function with new superadmin email
CREATE OR REPLACE FUNCTION delete_admin_properly(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_email text;
BEGIN
    -- Get the current user's email
    SELECT email INTO current_user_email
    FROM auth.users
    WHERE id = auth.uid();

    -- Check if current user is the superadmin
    IF current_user_email != 'admin@gmail.com' THEN
        RAISE EXCEPTION 'Unauthorized. Only admin has account deletion powers.';
    END IF;

    -- Delete from profiles table (this will cascade to auth.users due to foreign key)
    DELETE FROM public.profiles WHERE id = target_user_id;
    
    -- Also delete from auth.users to ensure complete removal
    DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_admin_properly(uuid) TO authenticated;

-- =====================================================
-- OPTIONAL: Update existing user email and name
-- =====================================================
-- Uncomment and run these queries if you also need to
-- update the actual user data in the database

-- -- Update auth.users table
-- UPDATE auth.users 
-- SET email = 'admin@gmail.com',
--     raw_user_meta_data = jsonb_set(
--         COALESCE(raw_user_meta_data, '{}'::jsonb), 
--         '{full_name}', 
--         '"admin"'
--     )
-- WHERE email = 'farhan@gmail.com';

-- -- Update profiles table
-- UPDATE public.profiles 
-- SET email = 'admin@gmail.com',
--     full_name = 'admin'
-- WHERE email = 'farhan@gmail.com';
