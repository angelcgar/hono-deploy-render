# 🔗 Acortador de URLs

Acortador de URLs simple y funcional construido con **Bun**, **Hono.js** y **SQLite**.

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
bun install

# Configurar variables de entorno (opcional)
cp .env.example .env

# Ejecutar en desarrollo
bun run dev

# Abrir en el navegador
# http://localhost:3000
```

---

## ✨ Características Principales

- ✅ Acorta URLs largas en códigos de 6 caracteres
- ✅ **Dashboard de estadísticas** (`/stats`)
- ✅ **Contador de visitas** por URL
- ✅ **Tema oscuro/claro automático** (prefers-color-scheme)
- ✅ **UI accesible** (WCAG AA, navegación por teclado)
- ✅ **Diseño responsivo** mobile-first
- ✅ **Tests automatizados** (20 tests con Bun)
- ✅ Base de datos SQLite embebida
- ✅ TypeScript 100%

---

## 🛠️ Tecnologías

| Stack                           | Descripción               |
| ------------------------------- | ------------------------- |
| **[Bun](https://bun.sh)**       | Runtime ultra rápido      |
| **[Hono.js](https://hono.dev)** | Framework web minimalista |
| **TypeScript**                  | Tipado estático           |
| **SQLite**                      | Base de datos embebida    |
| **HTML/CSS/JS**                 | Frontend vanilla          |

---

## 📁 Estructura

```
src/
├── server/          # Backend TypeScript
│   ├── index.ts    # Entrada del servidor
│   ├── routes.ts   # Rutas y endpoints
│   └── db.ts       # Base de datos SQLite
├── public/          # Frontend estático
│   ├── index.html  # Página principal
│   ├── stats.html  # Dashboard
│   └── styles.css  # Estilos unificados
├── config/          # Configuración
│   └── env.ts      # Variables de entorno
└── tests/           # Tests automatizados
    ├── db.test.ts
    └── routes.test.ts
```

---

## 🌐 Endpoints

| Método | Ruta         | Descripción                  |
| ------ | ------------ | ---------------------------- |
| `GET`  | `/`          | Página principal             |
| `GET`  | `/stats`     | Dashboard de estadísticas    |
| `GET`  | `/api/urls`  | Lista todas las URLs         |
| `GET`  | `/api/stats` | Estadísticas JSON            |
| `POST` | `/api/short` | Crear URL corta              |
| `GET`  | `/:code`     | Redireccionar (con tracking) |

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
bun test

# Tests con watch mode
bun test:watch

# Resultados: ✓ 20 tests, 44 expect() calls
```

Tests incluidos:
- ✅ Base de datos (inserts, queries, contador)
- ✅ Rutas HTTP (creación, redirección, validación)
- ✅ API responses (JSON, status codes)

---

## ⚙️ Variables de Entorno

```env
PORT=3000
BASE_URL=http://localhost:3000
DB_PATH_DEV=./db/dev.sqlite
DB_PATH_PROD=./db/prod.sqlite
NODE_ENV=development
```

Ver `.env.example` para más detalles.

---

## 📊 Dashboard de Estadísticas

Accede a `/stats` para ver:
- Total de URLs creadas
- Total de visitas
- Tabla detallada con todas las URLs
- Ordenado por visitas (descendente)

---

## 📚 Documentación Completa

**➡️ [Ver documentación completa en docs/README.md](./docs/README.md)**

La documentación incluye:
- Arquitectura detallada del proyecto
- Esquema de base de datos
- Guía de endpoints de API
- Instrucciones de despliegue
- Información de testing
- Mejores prácticas

---

## 🚀 Scripts Disponibles

```bash
bun run dev         # Desarrollo con hot-reload
bun run start       # Producción
bun test            # Ejecutar tests
bun test:watch      # Tests en modo watch
```

---

## 🔒 Seguridad

⚠️ **Este proyecto es para demo/desarrollo**. Para producción:
- Implementar rate limiting
- Validación más estricta
- HTTPS obligatorio
- Considerar PostgreSQL para alto tráfico

---

## 📝 Licencia

MIT License - Uso libre para aprendizaje y desarrollo.

---

**Última actualización:** 2 de enero de 2026
