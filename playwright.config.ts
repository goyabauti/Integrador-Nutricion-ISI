import { defineConfig } from "@playwright/test";

/**
 * Configuración de Playwright para tests E2E y de carga.
 *
 * Usar BASE_URL para apuntar a producción:
 *   BASE_URL=https://integrador-nutricion-isi.vercel.app npx playwright test
 */
export default defineConfig({
  testDir: "./tests",

  /* Timeout generoso para tests de carga */
  timeout: 120_000,

  /* No reintentar — queremos ver fallos reales */
  retries: 0,

  /* Reporter HTML para visualizar resultados */
  reporter: [["html", { open: "never" }], ["list"]],

  /* Configuración global */
  use: {
    baseURL:
      process.env.BASE_URL ||
      "https://integrador-nutricion-isi.vercel.app",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /* Solo Chromium para los tests de carga */
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
