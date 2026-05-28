/** Rol de usuario autenticado (admin) */
export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

/** Pregunta / parámetro de evaluación */
export interface Question {
  id: number;
  order_index: number;
  text: string;
  category: string | null;
  active: boolean;
  created_at: string;
}

/** Evaluador anónimo (sin cuenta) */
export interface Respondent {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

/** Respuesta individual (score 1-5 por pregunta) */
export interface Response {
  id: string;
  respondent_id: string;
  question_id: number;
  score: number;
  created_at: string;
}

/** Comentario opcional del evaluador */
export interface Comment {
  id: string;
  respondent_id: string;
  content: string;
  is_visible: boolean;
  created_at: string;
}

/** Respondent con sus responses y comments incluidos (para respuestas de API) */
export interface RespondentWithDetails extends Respondent {
  responses: Response[];
  comments: Comment[];
}

/** Datos que envía el evaluador al hacer submit del formulario */
export interface SurveySubmission {
  name: string;
  email: string;
  comment?: string;
  responses: ResponseInput[];
}

/** Datos de una respuesta individual en el formulario */
export interface ResponseInput {
  question_id: number;
  score: number;
}

export const ESCALA_HEDONICA: Record<number, string> = {
  1: "No me gusta nada",
  2: "No me gusta",
  3: "Ni me gusta ni me disgusta",
  4: "Me gusta",
  5: "Me gusta mucho",
};

/** Promedio por categoría (para gráfico de araña) */
export interface CategoryAverage {
  category: string;
  label: string;
  promedio: number;
  totalResponses: number;
}

/** Promedio por pregunta individual */
export interface QuestionAverage {
  question_id: number;
  text: string;
  category: string | null;
  promedio: number;
  totalResponses: number;
}

/** Punto en la línea temporal */
export interface TimelinePoint {
  date: string;
  count: number;
  promedio: number;
}

/** Comentario con info del evaluador */
export interface RecentComment {
  id: string;
  content: string;
  is_visible: boolean;
  created_at: string;
  respondent_name: string;
  respondent_email: string;
}

/** Evaluación resumida */
export interface RecentEvaluation {
  id: string;
  name: string;
  email: string;
  created_at: string;
  promedio: number;
  totalResponses: number;
}

/** Datos completos del dashboard */
export interface DashboardData {
  totalEvaluaciones: number;
  promedioGeneral: number;
  scoreMasAlto: QuestionAverage | null;
  scoreMasBajo: QuestionAverage | null;
  promediosPorCategoria: CategoryAverage[];
  promediosPorPregunta: QuestionAverage[];
  distribucion: Record<number, number>;
  timeline: TimelinePoint[];
  comentariosRecientes: RecentComment[];
  evaluacionesRecientes: RecentEvaluation[];
}