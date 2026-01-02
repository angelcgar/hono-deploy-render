import { Hono } from "hono";
import { config } from "../config/env.js";
import { setupRoutes } from "./routes.js";

/**
 * Punto de entrada del servidor
 *
 * Inicializa la aplicación Hono, configura rutas y
 * arranca el servidor en el puerto especificado
 */

// Crear instancia de Hono
const app = new Hono();

// Configurar todas las rutas
setupRoutes(app);

// ============================================
// INICIAR SERVIDOR
// ============================================

console.log(`🚀 Servidor iniciado en http://localhost:${config.PORT}`);
console.log(`📝 Interfaz disponible en ${config.BASE_URL}/`);
console.log(`🔗 URLs acortadas usarán: ${config.BASE_URL}`);

// Exportar configuración del servidor para Bun
export default {
  port: config.PORT,
  fetch: app.fetch,
};
