import { describe, it, expect } from "bun:test";
import { Hono } from "hono";
import { setupRoutes } from "../server/routes";

/**
 * Tests de integración para las rutas HTTP
 *
 * Prueba los endpoints principales de la API
 */

describe("API Routes", () => {
  const app = new Hono();
  setupRoutes(app);

  describe("GET /api/stats", () => {
    it("debe retornar estadísticas en formato JSON", async () => {
      const req = new Request("http://localhost/api/stats");
      const res = await app.fetch(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/json");

      const data = await res.json();
      expect(data).toHaveProperty("totalURLs");
      expect(data).toHaveProperty("totalVisits");
      expect(data).toHaveProperty("urls");
      expect(Array.isArray(data.urls)).toBe(true);
    });
  });

  describe("GET /api/urls", () => {
    it("debe retornar lista de URLs en formato JSON", async () => {
      const req = new Request("http://localhost/api/urls");
      const res = await app.fetch(req);

      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/json");

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("POST /api/short", () => {
    it("debe crear una URL corta con datos válidos", async () => {
      const testURL = `https://ejemplo.com/test-${Date.now()}`;
      const req = new Request("http://localhost/api/short", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: testURL }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.original_url).toBe(testURL);
      expect(data.short_code).toBeDefined();
      expect(data.short_url).toContain(data.short_code);
    });

    it("debe rechazar URLs inválidas", async () => {
      const req = new Request("http://localhost/api/short", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "no-es-una-url" }),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it("debe rechazar peticiones sin URL", async () => {
      const req = new Request("http://localhost/api/short", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);

      const data = await res.json();
      expect(data.success).toBe(false);
    });
  });

  describe("GET /:short_code (redirect)", () => {
    it("debe redirigir correctamente cuando el código existe", async () => {
      // Primero crear una URL
      const testURL = `https://ejemplo.com/redirect-test-${Date.now()}`;
      const createReq = new Request("http://localhost/api/short", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: testURL }),
      });

      const createRes = await app.fetch(createReq);
      const createData = await createRes.json();
      const shortCode = createData.short_code;

      // Ahora probar la redirección
      const redirectReq = new Request(`http://localhost/${shortCode}`);
      const redirectRes = await app.fetch(redirectReq);

      expect(redirectRes.status).toBe(301);
      expect(redirectRes.headers.get("Location")).toBe(testURL);
    });

    it("debe retornar 404 cuando el código no existe", async () => {
      const req = new Request("http://localhost/noexiste123");
      const res = await app.fetch(req);

      expect(res.status).toBe(404);
    });
  });
});
