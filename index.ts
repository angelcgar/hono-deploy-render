import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import {
  getAllURLs,
  getURLByShortCode,
  insertURL,
  shortCodeExists,
} from "./db";

const app = new Hono();

// Configuración desde variables de entorno con valores por defecto
const PORT = Number(process.env.PORT) || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/**
 * Genera un código corto aleatorio único
 * Usa caracteres alfanuméricos para crear códigos de 6 caracteres
 */
function generateShortCode(): string {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 6;
  let shortCode = "";

  do {
    shortCode = "";
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      shortCode += characters[randomIndex];
    }
  } while (shortCodeExists(shortCode));

  return shortCode;
}

/**
 * Valida si una URL tiene formato correcto
 */
function isValidURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

// ============================================
// RUTAS
// ============================================

/**
 * GET / - Sirve la página principal HTML
 */
app.get("/", serveStatic({ path: "./public/index.html" }));

/**
 * GET /styles.css - Sirve el archivo de estilos
 */
app.get("/styles.css", serveStatic({ path: "./public/styles.css" }));

/**
 * GET /api/urls - Obtiene todas las URLs guardadas
 */
app.get("/api/urls", (c) => {
  const urls = getAllURLs();
  return c.json(urls);
});

/**
 * POST /api/short - Crea una URL acortada
 * Body: { url: string }
 * Response: { success: boolean, short_url: string, short_code: string }
 */
app.post("/api/short", async (c) => {
  try {
    const body = await c.req.json();
    const originalUrl = body.url;

    // Validar que se proporcionó una URL
    if (!originalUrl || typeof originalUrl !== "string") {
      return c.json(
        { success: false, error: "URL es requerida" },
        400
      );
    }

    // Validar formato de URL
    if (!isValidURL(originalUrl)) {
      return c.json(
        { success: false, error: "URL inválida. Debe incluir http:// o https://" },
        400
      );
    }

    // Generar código corto único
    const shortCode = generateShortCode();

    // Guardar en la base de datos
    const record = insertURL(originalUrl, shortCode);

    // Construir la URL completa acortada usando BASE_URL
    const shortUrl = `${BASE_URL}/${shortCode}`;

    return c.json({
      success: true,
      short_url: shortUrl,
      short_code: shortCode,
      original_url: record.original_url,
      created_at: record.created_at,
    });
  } catch (error) {
    console.error("Error al acortar URL:", error);
    return c.json(
      { success: false, error: "Error interno del servidor" },
      500
    );
  }
});

/**
 * GET /:short_code - Redirecciona a la URL original
 */
app.get("/:short_code", (c) => {
  const shortCode = c.req.param("short_code");

  // Buscar la URL en la base de datos
  const record = getURLByShortCode(shortCode);

  if (!record) {
    return c.text("URL no encontrada", 404);
  }

  // Redireccionar a la URL original
  return c.redirect(record.original_url, 301);
});

// ============================================
// INICIAR SERVIDOR
// ============================================

console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
console.log(`📝 Interfaz disponible en ${BASE_URL}/`);
console.log(`🔗 URLs acortadas usarán: ${BASE_URL}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
