import { test, expect } from "@playwright/test";
import {
  RequestResult,
  calculateStats,
  printLoadTestReport,
} from "./report-helpers";

const NUM_USERS = 100;
const BASE_URL =
  process.env.BASE_URL || "https://integrador-nutricion-isi.vercel.app";

/**
 * Test de carga — 100 usuarios simultáneos via API.
 *
 * Simula 100 evaluadores enviando sus respuestas al mismo tiempo.
 * Mide latencia, tasa de éxito, y percentiles.
 */
test.describe("Carga API — 100 usuarios simultáneos", () => {
  test("100 evaluadores envían el formulario en paralelo", async () => {
    // ── Paso 1: Obtener preguntas reales ──
    console.log("📋 Obteniendo preguntas desde /api/parametros ...");
    const paramRes = await fetch(`${BASE_URL}/api/parametros`);
    expect(paramRes.ok).toBeTruthy();

    const paramJson = await paramRes.json();
    expect(paramJson.success).toBeTruthy();
    expect(Array.isArray(paramJson.data)).toBeTruthy();

    const questions: { id: number }[] = paramJson.data;
    console.log(`  ${questions.length} preguntas activas encontradas`);
    console.log(`   IDs: [${questions.map((q) => q.id).join(", ")}]`);

    // ── Paso 2: Crear payloads para 100 usuarios ──
    const runId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const payloads = Array.from({ length: NUM_USERS }, (_, i) => ({
      name: `LoadTest User ${i + 1}`,
      email: `loadtest-${runId}-${i + 1}@test.com`,
      comment: `Test de carga #${i + 1} — ${new Date().toISOString()}`,
      responses: questions.map((q) => ({
        question_id: q.id,
        score: Math.floor(Math.random() * 5) + 1,
      })),
    }));

    // ── Paso 3: Lanzar 100 requests en paralelo ──
    console.log(`\n Lanzando ${NUM_USERS} requests POST simultáneos...`);
    const globalStart = Date.now();

    const promises = payloads.map(
      async (payload, index): Promise<RequestResult> => {
        const start = Date.now();
        try {
          const res = await fetch(`${BASE_URL}/api/evaluaciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const body = await res.json();
          const durationMs = Date.now() - start;

          return {
            index: index + 1,
            success: res.ok && body.success === true,
            status: res.status,
            durationMs,
            error: !res.ok || !body.success ? (body.error || `HTTP ${res.status}`) : undefined,
          };
        } catch (err) {
          return {
            index: index + 1,
            success: false,
            status: 0,
            durationMs: Date.now() - start,
            error: err instanceof Error ? err.message : String(err),
          };
        }
      }
    );

    const results = await Promise.all(promises);
    const totalTime = Date.now() - globalStart;

    // ── Paso 4: Calcular métricas ──
    const stats = calculateStats(results);
    const errors = results.filter((r) => !r.success);

    printLoadTestReport(
      `POST /api/evaluaciones — ${NUM_USERS} usuarios simultáneos`,
      stats,
      errors
    );

    console.log(`  Tiempo total (wall clock): ${totalTime} ms`);
    console.log(
      ` Throughput: ${((stats.successful / totalTime) * 1000).toFixed(1)} req/s`
    );

    // ── Paso 5: Assertions ──
    // Al menos 95% de éxito
    expect(
      stats.successful / stats.total,
      `Tasa de éxito (${stats.successRate}) debería ser >= 95%`
    ).toBeGreaterThanOrEqual(0.95);

    // Promedio debería ser < 10s (generoso para Vercel cold starts)
    expect(
      stats.avgMs,
      `Promedio (${stats.avgMs}ms) debería ser < 10000ms`
    ).toBeLessThan(10000);
  });

  test("100 requests GET /api/parametros en paralelo", async () => {
    console.log(
      `\n Lanzando ${NUM_USERS} requests GET /api/parametros simultáneos...`
    );
    const globalStart = Date.now();

    const promises = Array.from(
      { length: NUM_USERS },
      async (_, index): Promise<RequestResult> => {
        const start = Date.now();
        try {
          const res = await fetch(`${BASE_URL}/api/parametros`);
          const body = await res.json();
          const durationMs = Date.now() - start;

          return {
            index: index + 1,
            success: res.ok && body.success === true,
            status: res.status,
            durationMs,
            error: !res.ok ? `HTTP ${res.status}` : undefined,
          };
        } catch (err) {
          return {
            index: index + 1,
            success: false,
            status: 0,
            durationMs: Date.now() - start,
            error: err instanceof Error ? err.message : String(err),
          };
        }
      }
    );

    const results = await Promise.all(promises);
    const totalTime = Date.now() - globalStart;

    const stats = calculateStats(results);
    const errors = results.filter((r) => !r.success);

    printLoadTestReport(
      `GET /api/parametros — ${NUM_USERS} requests simultáneos`,
      stats,
      errors
    );

    console.log(`  Tiempo total: ${totalTime} ms`);
    console.log(
      ` Throughput: ${((stats.successful / totalTime) * 1000).toFixed(1)} req/s`
    );

    // 100% éxito esperado para GETs
    expect(
      stats.successful / stats.total,
      `Tasa de éxito GETs: ${stats.successRate}`
    ).toBeGreaterThanOrEqual(0.95);
  });
});
