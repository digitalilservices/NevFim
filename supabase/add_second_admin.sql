-- =========================================================
-- NEVFIM — ADD SECOND ADMIN EMAIL
-- Run this file once in Supabase SQL Editor after deployment.
-- It keeps the existing admin and adds NevFim.grup@gmail.com.
-- =========================================================

-- Orders
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can view all order items" ON public.order_items;

CREATE POLICY "Admin can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  lower(coalesce((select auth.jwt() ->> 'email'), '')) IN (
    'illypanferov15@gmail.com',
    'nevfim.grup@gmail.com'
  )
);

CREATE POLICY "Admin can update all orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  lower(coalesce((select auth.jwt() ->> 'email'), '')) IN (
    'illypanferov15@gmail.com',
    'nevfim.grup@gmail.com'
  )
)
WITH CHECK (
  lower(coalesce((select auth.jwt() ->> 'email'), '')) IN (
    'illypanferov15@gmail.com',
    'nevfim.grup@gmail.com'
  )
);

CREATE POLICY "Admin can view all order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  lower(coalesce((select auth.jwt() ->> 'email'), '')) IN (
    'illypanferov15@gmail.com',
    'nevfim.grup@gmail.com'
  )
);

-- Contact messages
DROP POLICY IF EXISTS "Admin can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin can delete closed contact messages" ON public.contact_messages;

CREATE POLICY "Admin can view contact messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (
  lower(coalesce((select auth.jwt() ->> 'email'), '')) IN (
    'illypanferov15@gmail.com',
    'nevfim.grup@gmail.com'
  )
);

CREATE POLICY "Admin can update contact messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (
  lower(coalesce((select auth.jwt() ->> 'email'), '')) IN (
    'illypanferov15@gmail.com',
    'nevfim.grup@gmail.com'
  )
)
WITH CHECK (
  lower(coalesce((select auth.jwt() ->> 'email'), '')) IN (
    'illypanferov15@gmail.com',
    'nevfim.grup@gmail.com'
  )
);

CREATE POLICY "Admin can delete closed contact messages"
ON public.contact_messages
FOR DELETE
TO authenticated
USING (
  lower(coalesce((select auth.jwt() ->> 'email'), '')) IN (
    'illypanferov15@gmail.com',
    'nevfim.grup@gmail.com'
  )
  AND status = 'closed'
);
