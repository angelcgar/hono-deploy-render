import { serveStatic } from "hono/bun";
import { config } from "../config/env.js";
import {
  getAllURLs,
  getURLByShortCode,
  insertURL,
  shortCodeExists,
} from "./db.js";

/**
 * Definición de rutas del servidor
 *
 * Separa la lógica de rutas del servidor principal
 * para mejor organización y mantenibilidad
 */

// ============================================
// UTILIDADES
// ============================================

/**
 * Genera un código corto aleatorio único
 * @returns {string} Código de 6 caracteres alfanuméricos
 */
function generateShortCode() {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 6;
  let shortCode = "";

  // Generar código hasta encontrar uno único
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
 * @param {string} url - URL a validar
 * @returns {boolean} true si es válida, false si no
 */
function isValidURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

// ============================================
// DEFINICIÓN DE RUTAS
// ============================================

/**
 * Configura todas las rutas de la aplicación
 * @param {Hono} app - Instancia de Hono
 */
export function setupRoutes(app) {

  // ============================================
  // RUTAS ESTÁTICAS
  // ============================================

  /**
   * GET / - Sirve la página principal HTML
   */
  app.get("/", serveStatic({ path: "./src/public/index.html" }));

  /**
   * GET /styles.css - Sirve el archivo de estilos
   */
  app.get("/styles.css", serveStatic({ path: "./src/public/styles.css" }));

  // ============================================
  // API ENDPOINTS
  // ============================================

  /**
   * GET /api/urls - Obtiene todas las URLs guardadas
   *
   * Response: Array de objetos URL
   */
  app.get("/api/urls", (c) => {
    const urls = getAllURLs();
    return c.json(urls);
  });

  /**
   * POST /api/short - Crea una URL acortada
   *
   * Body: { url: string }
   * Response: { success, short_url, short_code, original_url, created_at }
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

      // Construir la URL completa acortada
      const shortUrl = `${config.BASE_URL}/${shortCode}`;

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

  // ============================================
  // REDIRECCIÓN
  // ============================================

  /**
   * GET /:short_code - Redirecciona a la URL original
   *
   * Busca el código corto en la base de datos y redirecciona
   * a la URL original con código HTTP 301 (Moved Permanently)
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
}
