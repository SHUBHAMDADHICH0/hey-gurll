DROP POLICY IF EXISTS "No public read access" ON public.secret_messages;
CREATE POLICY "Anyone can read secret messages" ON public.secret_messages FOR SELECT TO public USING (true);