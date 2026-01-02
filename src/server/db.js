import { Database } from "bun:sqlite";
import { config } from "../config/env.js";

/**
 * Módulo de base de datos SQLite
 *
 * Gestiona la conexión, creación de tablas y operaciones CRUD
 * para el acortador de URLs
 */

// Inicializar conexión a SQLite
const db = new Database(config.DB_PATH);

// ============================================
// INICIALIZACIÓN DE TABLAS
// ============================================

/**
 * Crea la tabla de URLs si no existe
 *
 * Campos:
 * - id: Identificador único autoincremental
 * - original_url: URL completa original
 * - short_code: Código corto único (6 caracteres)
 * - created_at: Timestamp de creación
 */
db.run(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Crear índice para optimizar búsquedas por short_code
db.run(`
  CREATE INDEX IF NOT EXISTS idx_short_code
  ON urls(short_code)
`);

// ============================================
// OPERACIONES DE BASE DE DATOS
// ============================================

/**
 * Obtiene todas las URLs guardadas ordenadas por fecha
 * @returns {Array} Lista de todas las URLs
 */
export function getAllURLs() {
  const query = db.query("SELECT * FROM urls ORDER BY created_at DESC");
  return query.all();
}

/**
 * Busca una URL por su código corto
 * @param {string} shortCode - Código corto a buscar
 * @returns {Object|null} Registro de URL o null si no existe
 */
export function getURLByShortCode(shortCode) {
  const query = db.query("SELECT * FROM urls WHERE short_code = ?");
  return query.get(shortCode);
}

/**
 * Inserta una nueva URL en la base de datos
 * @param {string} originalUrl - URL original completa
 * @param {string} shortCode - Código corto único generado
 * @returns {Object} Registro insertado
 */
export function insertURL(originalUrl, shortCode) {
  const query = db.query(
    "INSERT INTO urls (original_url, short_code) VALUES (?, ?) RETURNING *"
  );
  return query.get(originalUrl, shortCode);
}

/**
 * Verifica si un código corto ya existe en la base de datos
 * @param {string} shortCode - Código corto a verificar
 * @returns {boolean} true si existe, false si no
 */
export function shortCodeExists(shortCode) {
  const query = db.query("SELECT COUNT(*) as count FROM urls WHERE short_code = ?");
  const result = query.get(shortCode);
  return result.count > 0;
}

export default db;
