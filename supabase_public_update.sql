-- 1. Add visibility columns
ALTER TABLE public.ai_personas ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE public.memorial_messages ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- 2. Update RLS for public personas
-- Allow anyone to view public personas
CREATE POLICY "Public personas are visible to everyone." 
ON public.ai_personas FOR SELECT 
USING (is_public = true);

-- 3. Update RLS for memorial messages
-- Allow anyone to view approved messages
DROP POLICY IF EXISTS "Anyone can view memorial messages." ON public.memorial_messages;
CREATE POLICY "Approved memorial messages are visible to everyone." 
ON public.memorial_messages FOR SELECT 
USING (is_approved = true);

-- Owners can still see all messages for their memorials
CREATE POLICY "Owners can see all messages for their memorials." 
ON public.memorial_messages FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.memorials m
    JOIN public.ai_personas p ON m.persona_id = p.id
    WHERE m.id = memorial_messages.memorial_id AND p.user_id = auth.uid()
  )
);

-- Owners can approve messages (UPDATE)
CREATE POLICY "Owners can approve memorial messages." 
ON public.memorial_messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.memorials m
    JOIN public.ai_personas p ON m.persona_id = p.id
    WHERE m.id = memorial_messages.memorial_id AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.memorials m
    JOIN public.ai_personas p ON m.persona_id = p.id
    WHERE m.id = memorial_messages.memorial_id AND p.user_id = auth.uid()
  )
);

-- 4. Update memory RLS to allow public memorial viewing
-- We need to make sure memorials themselves are viewable if the persona is public
DROP POLICY IF EXISTS "Anyone can view memorials." ON public.memorials;
CREATE POLICY "Public memorials are visible to everyone." 
ON public.memorials FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.ai_personas p 
    WHERE p.id = memorials.persona_id AND p.is_public = true
  ) OR (
    EXISTS (
      SELECT 1 FROM public.ai_personas p 
      WHERE p.id = memorials.persona_id AND p.user_id = auth.uid()
    )
  )
);
