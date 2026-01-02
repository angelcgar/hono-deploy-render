-- ⚠️⚠️⚠️ ADVERTENCIA: ESTE SCRIPT ES DESTRUCTIVO ⚠️⚠️⚠️
--
-- Este script eliminará TODAS las tablas y TODOS los datos
-- de la base de datos SQLite de forma permanente.
--
-- ⚠️ NO EJECUTAR EN PRODUCCIÓN
-- ⚠️ SOLO USAR EN DESARROLLO LOCAL
-- ⚠️ ASEGÚRATE DE TENER UN BACKUP SI NECESITAS LOS DATOS
--
-- Uso:
--   sqlite3 urls.db < src/server/reset-db.sql
--
-- O desde Bun/Node:
--   bun run scripts/reset-db.js
--
-- ============================================

-- Eliminar la tabla de URLs (esto borra todos los registros)
DROP TABLE IF EXISTS urls;

-- Eliminar el índice de búsqueda
DROP INDEX IF EXISTS idx_short_code;

-- ============================================
-- RECREAR ESTRUCTURA LIMPIA (OPCIONAL)
-- ============================================
-- Puedes descomentar las siguientes líneas si quieres
-- recrear las tablas inmediatamente después del reset

/*
CREATE TABLE IF NOT EXISTS urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  original_url TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  visit_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_short_code
ON urls(short_code);
*/

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para verificar que la base de datos está vacía:
--   sqlite3 urls.db ".tables"
--
-- No debería mostrar ninguna tabla
