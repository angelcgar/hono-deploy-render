import { Database } from "bun:sqlite";
import { config } from "../config/env";

/**
 * Módulo de base de datos SQLite
 *
 * Gestiona la conexión, creación de tablas y operaciones CRUD
 * para el acortador de URLs
 */

// Interfaz para el modelo de URL
export interface URLRecord {
  id: number;
  original_url: string;
  short_code: string;
  created_at: string;
  visit_count: number;
}

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
 * - visit_count: Contador de visitas (inicializado en 0)
 */
db.run(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    visit_count INTEGER DEFAULT 0
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
 */
export function getAllURLs(): URLRecord[] {
  const query = db.query("SELECT * FROM urls ORDER BY created_at DESC");
  return query.all() as URLRecord[];
}

/**
 * Busca una URL por su código corto
 */
export function getURLByShortCode(shortCode: string): URLRecord | null {
  const query = db.query("SELECT * FROM urls WHERE short_code = ?");
  return query.get(shortCode) as URLRecord | null;
}

/**
 * Inserta una nueva URL en la base de datos
 */
export function insertURL(
  originalUrl: string,
  shortCode: string
): URLRecord {
  const query = db.query(
    "INSERT INTO urls (original_url, short_code) VALUES (?, ?) RETURNING *"
  );
  return query.get(originalUrl, shortCode) as URLRecord;
}

/**
 * Verifica si un código corto ya existe en la base de datos
 */
export function shortCodeExists(shortCode: string): boolean {
  const query = db.query(
    "SELECT COUNT(*) as count FROM urls WHERE short_code = ?"
  );
  const result = query.get(shortCode) as { count: number };
  return result.count > 0;
}

/**
 * Incrementa el contador de visitas para una URL
 */
export function incrementVisitCount(shortCode: string): void {
  const query = db.query(
    "UPDATE urls SET visit_count = visit_count + 1 WHERE short_code = ?"
  );
  query.run(shortCode);
}

export default db;
