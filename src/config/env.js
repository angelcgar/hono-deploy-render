/**
 * Configuración de variables de entorno
 *
 * Centraliza la lectura y exportación de variables de entorno
 * con valores por defecto para desarrollo local
 */

export const config = {
  // Puerto del servidor
  PORT: Number(process.env.PORT) || 3000,

  // URL base para las URLs acortadas
  // En desarrollo: http://localhost:3000
  // En producción: la URL del dominio
  BASE_URL: process.env.BASE_URL || `http://localhost:${Number(process.env.PORT) || 3000}`,

  // Ruta de la base de datos SQLite
  DB_PATH: process.env.DB_PATH || "urls.db"
};
