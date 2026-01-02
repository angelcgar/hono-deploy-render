#!/usr/bin/env bun

/**
 * Script para resetear la base de datos
 *
 * ⚠️ ADVERTENCIA: Este script eliminará TODOS los datos
 *
 * Uso:
 *   bun run scripts/reset-db.ts
 *
 * O con confirmación:
 *   bun run scripts/reset-db.ts --confirm
 */

import { Database } from "bun:sqlite";
import { config } from "../src/config/env";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Verificar si se pasó el flag de confirmación
const args = process.argv.slice(2);
const hasConfirm = args.includes("--confirm");

if (!hasConfirm) {
  console.error("\n⚠️  ADVERTENCIA: Este script eliminará TODOS los datos de la base de datos\n");
  console.error("Para ejecutar el reset, usa:");
  console.error("  bun run scripts/reset-db.ts --confirm\n");
  process.exit(1);
}

console.log("\n🗑️  Reseteando base de datos...");
console.log(`📁 Archivo: ${config.DB_PATH}\n`);

try {
  // Leer el script SQL
  const sqlScript = readFileSync(
    join(__dirname, "../src/server/reset-db.sql"),
    "utf-8"
  );

  // Conectar a la base de datos
  const db = new Database(config.DB_PATH);

  // Ejecutar el script SQL
  // Dividir por líneas y ejecutar solo las que no son comentarios
  const lines = sqlScript
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith("--") && !trimmed.startsWith("/*");
    });

  const statements = lines.join("\n").split(";").filter((s) => s.trim());

  for (const statement of statements) {
    if (statement.trim()) {
      db.run(statement);
    }
  }

  db.close();

  console.log("✅ Base de datos reseteada exitosamente");
  console.log("\n💡 Reinicia el servidor para recrear las tablas\n");
} catch (error) {
  console.error("\n❌ Error al resetear la base de datos:");
  console.error(error);
  process.exit(1);
}
