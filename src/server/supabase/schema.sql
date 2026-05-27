-- =============================================
-- SCHEMA: Evaluación de Budín Nutritivo
-- Basado en el diagrama de Supabase
-- =============================================
-- FLUJO:
--   Respondents (evaluadores): NO necesitan cuenta. Ponen nombre y email.
--   Admin: Sí necesita cuenta (auth de Supabase) para ver resultados.
-- =============================================

-- Limpiar tablas existentes
DROP TABLE IF EXISTS public.responses CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.respondents CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- 1. user_roles (admin auth)
--    Vinculado a auth.users de Supabase.
CREATE TABLE public.user_roles (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role       TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. questions (parámetros de evaluación)
CREATE TABLE public.questions (
  id          INT4 GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_index INT4 NOT NULL DEFAULT 0,
  text        TEXT NOT NULL,
  category    TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. respondents (evaluadores anónimos, sin cuenta)
CREATE TABLE public.respondents (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. responses (calificaciones, score 1-5)
CREATE TABLE public.responses (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  respondent_id UUID REFERENCES public.respondents(id) ON DELETE CASCADE NOT NULL,
  question_id   INT4 REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  score         INT4 NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(respondent_id, question_id)
);

-- 5. comments (comentarios opcionales del evaluador)
CREATE TABLE public.comments (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  respondent_id UUID REFERENCES public.respondents(id) ON DELETE CASCADE NOT NULL,
  content       TEXT NOT NULL,
  is_visible    BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE public.user_roles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respondents  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments     ENABLE ROW LEVEL SECURITY;

-- user_roles: solo el admin ve su propio rol
DROP POLICY IF EXISTS "Rol propio" ON public.user_roles;
CREATE POLICY "Rol propio" ON public.user_roles
  FOR ALL USING (auth.uid() = user_id);

-- questions: cualquiera puede leer (necesario para el formulario público)
DROP POLICY IF EXISTS "Lectura pública de questions" ON public.questions;
CREATE POLICY "Lectura pública de questions" ON public.questions
  FOR SELECT USING (true);

-- questions: solo admin puede insertar/actualizar/eliminar
DROP POLICY IF EXISTS "Admin gestiona questions" ON public.questions;
CREATE POLICY "Admin gestiona questions" ON public.questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
  );

-- respondents: cualquiera puede insertar (evaluador anónimo)
DROP POLICY IF EXISTS "Inserción pública de respondents" ON public.respondents;
CREATE POLICY "Inserción pública de respondents" ON public.respondents
  FOR INSERT WITH CHECK (true);

-- respondents: solo admin puede leer
DROP POLICY IF EXISTS "Admin lee respondents" ON public.respondents;
CREATE POLICY "Admin lee respondents" ON public.respondents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
  );

-- responses: cualquiera puede insertar (evaluador anónimo)
DROP POLICY IF EXISTS "Inserción pública de responses" ON public.responses;
CREATE POLICY "Inserción pública de responses" ON public.responses
  FOR INSERT WITH CHECK (true);

-- responses: solo admin puede leer
DROP POLICY IF EXISTS "Admin lee responses" ON public.responses;
CREATE POLICY "Admin lee responses" ON public.responses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
  );

-- comments: cualquiera puede insertar (evaluador anónimo)
DROP POLICY IF EXISTS "Inserción pública de comments" ON public.comments;
CREATE POLICY "Inserción pública de comments" ON public.comments
  FOR INSERT WITH CHECK (true);

-- comments: solo admin puede leer
DROP POLICY IF EXISTS "Admin lee comments" ON public.comments;
CREATE POLICY "Admin lee comments" ON public.comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
  );

-- =============================================
-- GRANT: Permisos de rol
-- =============================================
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON public.questions TO anon;
GRANT INSERT ON public.respondents TO anon;
GRANT INSERT ON public.responses TO anon;
GRANT INSERT ON public.comments TO anon;

GRANT ALL ON public.user_roles TO authenticated;
GRANT ALL ON public.questions TO authenticated;
GRANT ALL ON public.respondents TO authenticated;
GRANT ALL ON public.responses TO authenticated;
GRANT ALL ON public.comments TO authenticated;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =============================================
-- DATOS INICIALES: Questions (escala hedónica)

-- =============================================
INSERT INTO public.questions (order_index, text, category) VALUES
  (1, 'Sabor',              'hedonica'),
  (2, 'Olor / Aroma',       'hedonica'),
  (3, 'Color',              'hedonica'),
  (4, 'Textura',            'hedonica'),
  (5, 'Humedad',            'hedonica'),
  (6, 'Aceptación general', 'hedonica');

-- Atributos positivos (descriptiva)
INSERT INTO public.questions (order_index, text, category) VALUES
  (7,  'Manzana',             'positivos'),
  (8,  'Zucchini',            'positivos'),
  (9,  'Huevo',               'positivos'),
  (10, 'Esencia de vainilla', 'positivos'),
  (11, 'Azúcar rubia',        'positivos'),
  (12, 'Lentejas',            'positivos'),
  (13, 'Harina de avena',     'positivos'),
  (14, 'Cacao amargo',        'positivos'),
  (15, 'Aceite',              'positivos'),
  (16, 'Polvo de hornear',    'positivos');

-- Atributos generales (descriptiva)
INSERT INTO public.questions (order_index, text, category) VALUES
  (17, 'Aroma dulce',            'generales'),
  (18, 'Aroma tostado',          'generales'),
  (19, 'Aroma vegetal',          'generales'),
  (20, 'Humedad',                'generales'),
  (21, 'Esponjosidad',           'generales'),
  (22, 'Suavidad en boca',       'generales'),
  (23, 'Persistencia del sabor', 'generales'),
  (24, 'Balance general',        'generales');

-- Defectos (descriptiva)
INSERT INTO public.questions (order_index, text, category) VALUES
  (25, 'Sabor metálico',              'defectos'),
  (26, 'Amargor excesivo',            'defectos'),
  (27, 'Aroma artificial',            'defectos'),
  (28, 'Sequedad',                    'defectos'),
  (29, 'Sabor residual desagradable', 'defectos'),
  (30, 'Exceso de aceite',            'defectos'),
  (31, 'Otros defectos',              'defectos');