-- Fix infinite recursion in admin policies
-- Run this in Supabase SQL Editor

-- First, drop all the problematic admin policies
DROP POLICY IF EXISTS "Admins can view all customers" ON customers;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage all products" ON products;
DROP POLICY IF EXISTS "Admins can view all addresses" ON addresses;
DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;

-- Add is_admin column if not exists
ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_customers_is_admin ON customers(is_admin) WHERE is_admin = true;

-- Create a helper function to check if current user is admin
-- This avoids the infinite recursion by using a direct query
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM customers
    WHERE id = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create admin policies using the function

-- Customers: Keep existing user policies, add admin policy
CREATE POLICY "Admins can view all customers" ON customers
  FOR SELECT USING (is_admin());

-- Orders: Admins can view and update all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (is_admin());

-- Order Items: Admins can view all
CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (is_admin());

-- Products: Everyone can view, admins can manage
CREATE POLICY "Admins can manage all products" ON products
  FOR ALL USING (is_admin());

-- Addresses: Admins can view all
CREATE POLICY "Admins can view all addresses" ON addresses
  FOR SELECT USING (is_admin());

-- Reviews: Admins can view and update all
CREATE POLICY "Admins can view all reviews" ON reviews
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can update reviews" ON reviews
  FOR UPDATE USING (is_admin());

-- IMPORTANT: After running this, set admin status for your account:
-- UPDATE customers SET is_admin = true WHERE email = 'your-admin-email@example.com';
