import { Database } from "bun:sqlite";

// Interfaz para el modelo de URL
export interface URLRecord {
  id: number;
  original_url: string;
  short_code: string;
  created_at: string;
}

// Inicializar la base de datos SQLite
const db = new Database("urls.db");

// Crear la tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_url TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Crear índice para búsquedas rápidas por short_code
db.run(`
  CREATE INDEX IF NOT EXISTS idx_short_code
  ON urls(short_code)
`);

/**
 * Obtiene todas las URLs guardadas
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
export function insertURL(originalUrl: string, shortCode: string): URLRecord {
  const query = db.query(
    "INSERT INTO urls (original_url, short_code) VALUES (?, ?) RETURNING *"
  );
  return query.get(originalUrl, shortCode) as URLRecord;
}

/**
 * Verifica si un código corto ya existe
 */
export function shortCodeExists(shortCode: string): boolean {
  const query = db.query("SELECT COUNT(*) as count FROM urls WHERE short_code = ?");
  const result = query.get(shortCode) as { count: number };
  return result.count > 0;
}

export default db;
