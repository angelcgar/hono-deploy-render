/**
 * Configuración de variables de entorno
 *
 * Centraliza la lectura y exportación de variables de entorno
 * con valores por defecto para desarrollo local
 */

interface Config {
  PORT: number;
  BASE_URL: string;
  DB_PATH: string;
  NODE_ENV: string;
}

// Determinar si estamos en producción
const isProduction = process.env.NODE_ENV === "production";

// Rutas de base de datos según entorno
const DB_PATH_DEV = process.env.DB_PATH_DEV || "./db/dev.sqlite";
const DB_PATH_PROD = process.env.DB_PATH_PROD || "./db/prod.sqlite";

export const config: Config = {
  // Puerto del servidor
  PORT: Number(process.env.PORT) || 3000,

  // URL base para las URLs acortadas
  // En desarrollo: http://localhost:3000
  // En producción: la URL del dominio
  BASE_URL:
    process.env.BASE_URL ||
    `http://localhost:${Number(process.env.PORT) || 3000}`,

  // Ruta de la base de datos SQLite según entorno
  // Desarrollo → ./db/dev.sqlite
  // Producción → ./db/prod.sqlite
  DB_PATH: isProduction ? DB_PATH_PROD : DB_PATH_DEV,

  // Entorno actual
  NODE_ENV: process.env.NODE_ENV || "development",
};
