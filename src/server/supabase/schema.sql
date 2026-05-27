-- =============================================
-- SCHEMA: Evaluación de Budín Nutritivo
-- Escala hedónica 1-5
-- Ficha 1: Hedónica | Ficha 2: Descriptiva
-- =============================================
-- FLUJO:
--   Evaluadores: NO necesitan cuenta. Ponen nombre, apellido y email.
--   Admin: Sí necesita cuenta (auth de Supabase) para ver resultados.
-- =============================================

-- Limpiar tablas existentes
DROP TABLE IF EXISTS public.calificaciones CASCADE;
DROP TABLE IF EXISTS public.evaluaciones CASCADE;
DROP TABLE IF EXISTS public.parametros CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Perfiles (solo admin)
--    Se crea manualmente en Supabase para cada admin.
CREATE TABLE public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre     TEXT NOT NULL,
  email      TEXT NOT NULL,
  rol        TEXT NOT NULL DEFAULT 'admin' CHECK (rol IN ('admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Parámetros de evaluación
--    ficha:     'hedonica' | 'descriptiva'
--    categoria: NULL (para hedónica) | 'positivos' | 'generales' | 'defectos'
CREATE TABLE public.parametros (
  id          SERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  ficha       TEXT NOT NULL CHECK (ficha IN ('hedonica', 'descriptiva')),
  categoria   TEXT CHECK (categoria IN ('positivos', 'generales', 'defectos')),
  activo      BOOLEAN DEFAULT TRUE,
  orden       INTEGER DEFAULT 0
);

-- 3. Evaluaciones (datos del evaluador directo, SIN cuenta)
CREATE TABLE public.evaluaciones (
  id          SERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  email       TEXT NOT NULL,
  comentario  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Calificaciones (valor 1-5 hedónico, observación opcional)
CREATE TABLE public.calificaciones (
  id            SERIAL PRIMARY KEY,
  evaluacion_id INTEGER REFERENCES public.evaluaciones(id) ON DELETE CASCADE NOT NULL,
  parametro_id  INTEGER REFERENCES public.parametros(id) ON DELETE CASCADE NOT NULL,
  valor         INTEGER NOT NULL CHECK (valor BETWEEN 1 AND 5),
  observacion   TEXT,
  UNIQUE(evaluacion_id, parametro_id)
);

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametros     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calificaciones ENABLE ROW LEVEL SECURITY;

-- Profiles: solo el admin ve/edita su propio perfil
CREATE POLICY "Perfil propio" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- Parametros: cualquiera puede leer (incluso anónimos, para el formulario)
CREATE POLICY "Lectura pública de parametros" ON public.parametros
  FOR SELECT USING (true);

-- Parametros: solo admin puede insertar/actualizar/eliminar
CREATE POLICY "Admin gestiona parametros" ON public.parametros
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.rol = 'admin')
  );

-- Evaluaciones: cualquiera puede insertar (evaluador anónimo)
CREATE POLICY "Inserción pública de evaluaciones" ON public.evaluaciones
  FOR INSERT WITH CHECK (true);

-- Evaluaciones: solo admin puede leer
CREATE POLICY "Admin lee evaluaciones" ON public.evaluaciones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.rol = 'admin')
  );

-- Calificaciones: cualquiera puede insertar (evaluador anónimo)
CREATE POLICY "Inserción pública de calificaciones" ON public.calificaciones
  FOR INSERT WITH CHECK (true);

-- Calificaciones: solo admin puede leer
CREATE POLICY "Admin lee calificaciones" ON public.calificaciones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.rol = 'admin')
  );

-- =============================================
-- DATOS INICIALES: Parámetros de evaluación
-- =============================================

-- FICHA 1: Escala hedónica
INSERT INTO public.parametros (nombre, ficha, categoria, orden) VALUES
  ('Sabor',              'hedonica', NULL, 1),
  ('Olor / Aroma',       'hedonica', NULL, 2),
  ('Color',              'hedonica', NULL, 3),
  ('Textura',            'hedonica', NULL, 4),
  ('Humedad',            'hedonica', NULL, 5),
  ('Aceptación general', 'hedonica', NULL, 6);

-- FICHA 2: Atributos positivos
INSERT INTO public.parametros (nombre, ficha, categoria, orden) VALUES
  ('Manzana',            'descriptiva', 'positivos', 1),
  ('Zucchini',           'descriptiva', 'positivos', 2),
  ('Huevo',              'descriptiva', 'positivos', 3),
  ('Esencia de vainilla','descriptiva', 'positivos', 4),
  ('Azúcar rubia',       'descriptiva', 'positivos', 5),
  ('Lentejas',           'descriptiva', 'positivos', 6),
  ('Harina de avena',    'descriptiva', 'positivos', 7),
  ('Cacao amargo',       'descriptiva', 'positivos', 8),
  ('Aceite',             'descriptiva', 'positivos', 9),
  ('Polvo de hornear',   'descriptiva', 'positivos', 10);

-- FICHA 2: Atributos generales
INSERT INTO public.parametros (nombre, ficha, categoria, orden) VALUES
  ('Aroma dulce',            'descriptiva', 'generales', 1),
  ('Aroma tostado',          'descriptiva', 'generales', 2),
  ('Aroma vegetal',          'descriptiva', 'generales', 3),
  ('Humedad',                'descriptiva', 'generales', 4),
  ('Esponjosidad',           'descriptiva', 'generales', 5),
  ('Suavidad en boca',       'descriptiva', 'generales', 6),
  ('Persistencia del sabor', 'descriptiva', 'generales', 7),
  ('Balance general',        'descriptiva', 'generales', 8);

-- FICHA 2: Defectos
INSERT INTO public.parametros (nombre, ficha, categoria, orden) VALUES
  ('Sabor metálico',              'descriptiva', 'defectos', 1),
  ('Amargor excesivo',            'descriptiva', 'defectos', 2),
  ('Aroma artificial',            'descriptiva', 'defectos', 3),
  ('Sequedad',                    'descriptiva', 'defectos', 4),
  ('Sabor residual desagradable', 'descriptiva', 'defectos', 5),
  ('Exceso de aceite',            'descriptiva', 'defectos', 6),
  ('Otros defectos',              'descriptiva', 'defectos', 7);