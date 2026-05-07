-- ============================================================================
-- Invoice Numbering System Migration
-- Run this in Supabase SQL Editor once
-- ============================================================================

-- Create sequence for invoice numbers (starts at 1)
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- Add invoice_number column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50) UNIQUE;

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.invoice_number := 'INV-' || LPAD(nextval('invoice_seq')::text, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate invoice number on insert
DROP TRIGGER IF EXISTS set_invoice_number ON orders;
CREATE TRIGGER set_invoice_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_invoice_number();

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_invoice_number ON orders(invoice_number);
