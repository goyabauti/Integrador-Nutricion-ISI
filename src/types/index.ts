export type Rol = "admin";

/** Perfil de admin (único tipo de usuario con cuenta) */
export interface Profile {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  created_at: string;
}

/** Parámetro de evaluación (ej: Sabor, Textura, etc.) */
export interface Parametro {
  id: number;
  nombre: string;
  descripcion: string | null;
  ficha: "hedonica" | "descriptiva";
  categoria: "positivos" | "generales" | "defectos" | null;
  activo: boolean;
  orden: number;
}

/** Evaluación realizada por un evaluador anónimo (sin cuenta) */
export interface Evaluacion {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  comentario: string | null;
  created_at: string;
}

/** Calificación individual de un parámetro dentro de una evaluación */
export interface Calificacion {
  id: number;
  evaluacion_id: number;
  parametro_id: number;
  valor: number;
  observacion: string | null;
}

/** Evaluación con sus calificaciones incluidas (para respuestas de API) */
export interface EvaluacionConCalificaciones extends Evaluacion {
  calificaciones: Calificacion[];
}

/** Datos que envía el evaluador al hacer submit del formulario */
export interface EvaluacionInput {
  nombre: string;
  apellido: string;
  email: string;
  comentario?: string;
  calificaciones: CalificacionInput[];
}

/** Datos de una calificación individual en el formulario */
export interface CalificacionInput {
  parametro_id: number;
  valor: number;
  observacion?: string;
}

export const ESCALA_HEDONICA: Record<number, string> = {
  1: "No me gusta nada",
  2: "No me gusta",
  3: "Ni me gusta ni me disgusta",
  4: "Me gusta",
  5: "Me gusta mucho",
};