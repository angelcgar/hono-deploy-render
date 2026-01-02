import { describe, it, expect, beforeEach, afterAll } from "bun:test";
import { Database } from "bun:sqlite";
import {
  insertURL,
  getURLByShortCode,
  shortCodeExists,
  incrementVisitCount,
  getAllURLs,
  getStats,
} from "../server/db";

/**
 * Tests básicos para funciones de base de datos
 *
 * Nota: Estos tests usan la base de datos configurada en env.ts
 * Se recomienda usar NODE_ENV=test con una base de datos separada
 */

describe("Database Operations", () => {
  const testShortCode = "test01";
  const testURL = "https://ejemplo.com/test-url";

  beforeEach(() => {
    // Limpiar datos de prueba si existen
    const db = new Database(process.env.DB_PATH_DEV || "./db/dev.sqlite");
    db.run("DELETE FROM urls WHERE short_code = ?", [testShortCode]);
    db.close();
  });

  afterAll(() => {
    // Limpiar después de todos los tests
    const db = new Database(process.env.DB_PATH_DEV || "./db/dev.sqlite");
    db.run("DELETE FROM urls WHERE short_code = ?", [testShortCode]);
    db.close();
  });

  describe("insertURL", () => {
    it("debe insertar una nueva URL correctamente", () => {
      const result = insertURL(testURL, testShortCode);

      expect(result).toBeDefined();
      expect(result.original_url).toBe(testURL);
      expect(result.short_code).toBe(testShortCode);
      expect(result.visit_count).toBe(0);
    });

    it("la URL insertada debe ser recuperable", () => {
      insertURL(testURL, testShortCode);
      const retrieved = getURLByShortCode(testShortCode);

      expect(retrieved).toBeDefined();
      expect(retrieved?.original_url).toBe(testURL);
    });
  });

  describe("getURLByShortCode", () => {
    it("debe retornar null si el código no existe", () => {
      const result = getURLByShortCode("noexiste");
      expect(result).toBeNull();
    });

    it("debe retornar la URL correcta si existe", () => {
      insertURL(testURL, testShortCode);
      const result = getURLByShortCode(testShortCode);

      expect(result).not.toBeNull();
      expect(result?.short_code).toBe(testShortCode);
    });
  });

  describe("shortCodeExists", () => {
    it("debe retornar false si el código no existe", () => {
      const exists = shortCodeExists("noexiste");
      expect(exists).toBe(false);
    });

    it("debe retornar true si el código existe", () => {
      insertURL(testURL, testShortCode);
      const exists = shortCodeExists(testShortCode);
      expect(exists).toBe(true);
    });
  });

  describe("incrementVisitCount", () => {
    it("debe incrementar el contador de visitas", () => {
      insertURL(testURL, testShortCode);

      const before = getURLByShortCode(testShortCode);
      expect(before?.visit_count).toBe(0);

      incrementVisitCount(testShortCode);

      const after = getURLByShortCode(testShortCode);
      expect(after?.visit_count).toBe(1);
    });

    it("debe incrementar múltiples veces correctamente", () => {
      insertURL(testURL, testShortCode);

      incrementVisitCount(testShortCode);
      incrementVisitCount(testShortCode);
      incrementVisitCount(testShortCode);

      const result = getURLByShortCode(testShortCode);
      expect(result?.visit_count).toBe(3);
    });
  });

  describe("getAllURLs", () => {
    it("debe retornar un array", () => {
      const urls = getAllURLs();
      expect(Array.isArray(urls)).toBe(true);
    });

    it("debe incluir la URL de prueba después de insertarla", () => {
      insertURL(testURL, testShortCode);
      const urls = getAllURLs();

      const found = urls.find((url) => url.short_code === testShortCode);
      expect(found).toBeDefined();
    });
  });

  describe("getStats", () => {
    it("debe retornar estadísticas con estructura correcta", () => {
      const stats = getStats();

      expect(stats).toHaveProperty("totalURLs");
      expect(stats).toHaveProperty("totalVisits");
      expect(stats).toHaveProperty("urls");
      expect(Array.isArray(stats.urls)).toBe(true);
    });

    it("debe contar correctamente las URLs", () => {
      const statsBefore = getStats();
      insertURL(testURL, testShortCode);
      const statsAfter = getStats();

      expect(statsAfter.totalURLs).toBe(statsBefore.totalURLs + 1);
    });

    it("debe contar correctamente las visitas totales", () => {
      insertURL(testURL, testShortCode);
      const statsBefore = getStats();

      incrementVisitCount(testShortCode);
      incrementVisitCount(testShortCode);

      const statsAfter = getStats();
      expect(statsAfter.totalVisits).toBe(statsBefore.totalVisits + 2);
    });
  });
});
