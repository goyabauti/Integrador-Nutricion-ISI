-- =============================================
-- SCHEMA: Evaluación de Budín Nutritivo
-- Escala hedónica 1-5
-- Ficha 1: Hedónica | Ficha 2: Descriptiva
-- =============================================

-- Limpiar tablas existentes
DROP TABLE IF EXISTS public.calificaciones CASCADE;
DROP TABLE IF EXISTS public.evaluaciones CASCADE;
DROP TABLE IF EXISTS public.parametros CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 1. Perfiles
CREATE TABLE public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre     TEXT NOT NULL,
  email      TEXT NOT NULL,
  rol        TEXT NOT NULL DEFAULT 'evaluador' CHECK (rol IN ('evaluador', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Parámetros
--    ficha:     'hedonica' | 'descriptiva'
--    categoria: NULL | 'positivos' | 'generales' | 'defectos'
CREATE TABLE public.parametros (
  id          SERIAL PRIMARY KEY,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  ficha       TEXT NOT NULL CHECK (ficha IN ('hedonica', 'descriptiva')),
  categoria   TEXT CHECK (categoria IN ('positivos', 'generales', 'defectos')),
  activo      BOOLEAN DEFAULT TRUE,
  orden       INTEGER DEFAULT 0
);

-- 3. Evaluaciones (una por usuario)
CREATE TABLE public.evaluaciones (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  comentario  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 4. Calificaciones (valor 1-5 hedónico, observacion opcional)
CREATE TABLE public.calificaciones (
  id            SERIAL PRIMARY KEY,
  evaluacion_id INTEGER REFERENCES public.evaluaciones(id) ON DELETE CASCADE NOT NULL,
  parametro_id  INTEGER REFERENCES public.parametros(id) ON DELETE CASCADE NOT NULL,
  valor         INTEGER NOT NULL CHECK (valor BETWEEN 1 AND 5),
  observacion   TEXT,
  UNIQUE(evaluacion_id, parametro_id)
);

-- RLS
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametros     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calificaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfil propio" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admin ve perfiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.rol = 'admin'));

CREATE POLICY "Todos leen parametros" ON public.parametros FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin gestiona parametros" ON public.parametros FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.rol = 'admin'));

CREATE POLICY "Evaluador inserta" ON public.evaluaciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Evaluador lee la suya" ON public.evaluaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin ve evaluaciones" ON public.evaluaciones FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.rol = 'admin'));

CREATE POLICY "Evaluador inserta calificaciones" ON public.calificaciones FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.evaluaciones e WHERE e.id = evaluacion_id AND e.user_id = auth.uid()));
CREATE POLICY "Evaluador lee sus calificaciones" ON public.calificaciones FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.evaluaciones e WHERE e.id = evaluacion_id AND e.user_id = auth.uid()));
CREATE POLICY "Admin ve calificaciones" ON public.calificaciones FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.rol = 'admin'));

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

-- Trigger: crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
    NEW.email,
    'evaluador'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();