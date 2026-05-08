-- Allow authenticated ADMINs to fully manage products
CREATE POLICY "Admins can insert products"
    ON products FOR INSERT TO authenticated
    WITH CHECK (is_admin_role());

CREATE POLICY "Admins can update products"
    ON products FOR UPDATE TO authenticated
    USING (is_admin_role());

CREATE POLICY "Admins can delete products"
    ON products FOR DELETE TO authenticated
    USING (is_admin_role());

-- Allow authenticated ADMINs and CASHIERs to read all products (including offline/sold)
CREATE POLICY "Staff can view all products"
    ON products FOR SELECT TO authenticated
    USING (is_admin_role() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'CASHIER'
    ));
