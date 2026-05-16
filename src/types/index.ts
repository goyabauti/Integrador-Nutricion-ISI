export type Rol = "evaluador" | "admin";

export interface Profile {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  created_at: string;
}

export interface Parametro {
  id: number;
  nombre: string;
  descripcion: string | null;
  ficha: "hedonica" | "descriptiva";
  categoria: "positivos" | "generales" | "defectos" | null;
  activo: boolean;
  orden: number;
}

export interface Evaluacion {
  id: number;
  user_id: string;
  comentario: string | null;
  created_at: string;
}

export interface Calificacion {
  id: number;
  evaluacion_id: number;
  parametro_id: number;
  valor: number;
  observacion: string | null;
}

export const ESCALA_HEDONICA: Record<number, string> = {
  1: "No me gusta nada",
  2: "No me gusta",
  3: "Ni me gusta ni me disgusta",
  4: "Me gusta",
  5: "Me gusta mucho",
};