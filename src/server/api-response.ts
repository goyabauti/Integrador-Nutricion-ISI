import { NextResponse } from "next/server";

/**
 * Respuestas estándar para las API routes.
 * Centraliza el formato de respuesta para mantener consistencia.
 */

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorizedResponse(message = "No autorizado") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = "Acceso denegado") {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = "Recurso no encontrado") {
  return errorResponse(message, 404);
}

export function serverErrorResponse(message = "Error interno del servidor") {
  return errorResponse(message, 500);
}
