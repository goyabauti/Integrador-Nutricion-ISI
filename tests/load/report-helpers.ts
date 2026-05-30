/**
 * Helpers para calcular y mostrar métricas de tests de carga.
 */

export interface RequestResult {
  index: number;
  success: boolean;
  status: number;
  durationMs: number;
  error?: string;
}

export interface LoadTestStats {
  total: number;
  successful: number;
  failed: number;
  successRate: string;
  avgMs: number;
  minMs: number;
  maxMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
}

/**
 * Calcula estadísticas de latencia a partir de un array de duraciones.
 */
export function calculateStats(results: RequestResult[]): LoadTestStats {
  const total = results.length;
  const successful = results.filter((r) => r.success).length;
  const failed = total - successful;

  const times = results
    .filter((r) => r.success)
    .map((r) => r.durationMs)
    .sort((a, b) => a - b);

  if (times.length === 0) {
    return {
      total,
      successful,
      failed,
      successRate: "0%",
      avgMs: 0,
      minMs: 0,
      maxMs: 0,
      p50Ms: 0,
      p95Ms: 0,
      p99Ms: 0,
    };
  }

  const sum = times.reduce((a, b) => a + b, 0);
  const percentile = (p: number) => times[Math.ceil((p / 100) * times.length) - 1];

  return {
    total,
    successful,
    failed,
    successRate: `${((successful / total) * 100).toFixed(1)}%`,
    avgMs: Math.round(sum / times.length),
    minMs: times[0],
    maxMs: times[times.length - 1],
    p50Ms: percentile(50),
    p95Ms: percentile(95),
    p99Ms: percentile(99),
  };
}

/**
 * Imprime un reporte formateado del test de carga.
 */
export function printLoadTestReport(
  title: string,
  stats: LoadTestStats,
  errors: RequestResult[]
): void {
  console.log("\n" + "═".repeat(60));
  console.log(`   ${title}`);
  console.log("═".repeat(60));
  console.log(`  Total requests:     ${stats.total}`);
  console.log(`   Exitosos:        ${stats.successful}`);
  console.log(`   Fallidos:        ${stats.failed}`);
  console.log(`   Tasa de éxito:   ${stats.successRate}`);
  console.log("─".repeat(60));
  console.log(`    Promedio:        ${stats.avgMs} ms`);
  console.log(`   Mínimo:          ${stats.minMs} ms`);
  console.log(`   Máximo:          ${stats.maxMs} ms`);
  console.log(`  P50:                ${stats.p50Ms} ms`);
  console.log(`  P95:                ${stats.p95Ms} ms`);
  console.log(`  P99:                ${stats.p99Ms} ms`);
  console.log("═".repeat(60));

  if (errors.length > 0) {
    console.log(`\n    Errores (primeros 10):`);
    errors.slice(0, 10).forEach((e) => {
      console.log(`    User #${e.index}: HTTP ${e.status} — ${e.error}`);
    });
  }
  console.log("");
}
