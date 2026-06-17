import { test, expect } from "@playwright/test";

/**
 * Test E2E funcional — flujo completo de UN evaluador.
 *
 * Verifica que el formulario carga, se completa, y se envía correctamente.
 * Sirve como línea base antes de correr los tests de carga.
 */
test.describe("Flujo de evaluación — 1 usuario", () => {
  test("completa el formulario y ve la pantalla de agradecimiento", async ({
    page,
  }) => {
    // 1. Navegar a /evaluar
    const startNav = Date.now();
    await page.goto("/evaluar");
    const navTime = Date.now() - startNav;
    console.log(`  Navegación a /evaluar: ${navTime} ms`);

    // 2. Esperar que las preguntas carguen (los sliders aparecen)
    const startLoad = Date.now();
    await page.waitForSelector('input[type="range"]', { timeout: 15000 });
    const loadTime = Date.now() - startLoad;
    console.log(`  Carga de preguntas: ${loadTime} ms`);

    // 3. Mover todos los sliders a un valor aleatorio (2-5)
    const sliders = page.locator('input[type="range"]');
    const sliderCount = await sliders.count();
    console.log(`📋 Cantidad de sliders/preguntas: ${sliderCount}`);

    for (let i = 0; i < sliderCount; i++) {
      const randomScore = Math.floor(Math.random() * 4) + 2;
      const slider = sliders.nth(i);
      // Forzar onChange en React cambiando primero a "1" y luego al score final
      await slider.fill("1");
      await slider.fill(String(randomScore));
    }

    // 5. Escribir un comentario
    await page.fill(
      'textarea[placeholder="¿Qué destacarías? ¿Qué mejorarías?"]',
      "Test E2E automatizado — verificando flujo completo"
    );

    // 6. Enviar el formulario
    const startSubmit = Date.now();
    await page.click('button[type="submit"]');

    // 7. Verificar pantalla de agradecimiento
    await expect(
      page.getByText("Gracias por participar", { exact: false })
    ).toBeVisible({
      timeout: 15000,
    });
    const submitTime = Date.now() - startSubmit;
    console.log(`  Submit + ThankYou render: ${submitTime} ms`);

    // Resumen
    console.log("\n Resumen del flujo E2E:");
    console.log(`   Navegación:  ${navTime} ms`);
    console.log(`   Carga:       ${loadTime} ms`);
    console.log(`   Submit:      ${submitTime} ms`);
    console.log(`   TOTAL:       ${navTime + loadTime + submitTime} ms`);
  });
});
