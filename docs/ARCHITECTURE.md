# Arquitectura del Proyecto

## Estructura de Carpetas

```
hono-deploy-render/
├── src/
│   ├── server/              # Código del servidor backend
│   │   ├── index.js        # Punto de entrada del servidor
│   │   ├── routes.js       # Definición de todas las rutas
│   │   └── db.js           # Gestión de base de datos SQLite
│   │
│   ├── public/             # Archivos estáticos del frontend
│   │   ├── index.html      # Interfaz de usuario
│   │   ├── styles.css      # Estilos CSS (dark/light mode)
│   │   └── main.js         # Lógica del cliente (opcional)
│   │
│   └── config/             # Configuración de la aplicación
│       └── env.js          # Variables de entorno centralizadas
│
├── docs/                   # Documentación del proyecto
│   ├── database.md         # Esquema y operaciones de BD
│   └── ARCHITECTURE.md     # Este archivo
│
├── .env                    # Variables de entorno (no versionado)
├── .env.example            # Ejemplo de variables de entorno
├── urls.db                 # Base de datos SQLite (generada)
├── package.json            # Dependencias y scripts npm
└── README.md               # Documentación principal
```

## Responsabilidades por Módulo

### 🔧 `src/config/env.js`
**Propósito:** Centralizar configuración y variables de entorno

**Responsabilidades:**
- Leer variables de entorno con `process.env`
- Proporcionar valores por defecto para desarrollo
- Exportar configuración consolidada

**Exports:**
```javascript
{
  PORT: number,
  BASE_URL: string,
  DB_PATH: string
}
```

### 🗄️ `src/server/db.js`
**Propósito:** Gestión de base de datos

**Responsabilidades:**
- Inicializar conexión a SQLite
- Crear tablas e índices
- Proporcionar funciones CRUD

**Funciones exportadas:**
- `getAllURLs()` - Obtiene todas las URLs
- `getURLByShortCode(code)` - Busca por código
- `insertURL(url, code)` - Inserta nueva URL
- `shortCodeExists(code)` - Verifica existencia

### 🛣️ `src/server/routes.js`
**Propósito:** Definición de rutas y lógica de endpoints

**Responsabilidades:**
- Configurar rutas estáticas (HTML, CSS)
- Implementar endpoints API
- Manejar redirecciones
- Validación de datos

**Rutas:**
- `GET /` - Página principal
- `GET /styles.css` - Estilos
- `GET /api/urls` - Lista de URLs
- `POST /api/short` - Crear URL corta
- `GET /:code` - Redireccionar

**Utilidades internas:**
- `generateShortCode()` - Genera códigos únicos
- `isValidURL()` - Valida formato de URLs

### 🚀 `src/server/index.js`
**Propósito:** Punto de entrada del servidor

**Responsabilidades:**
- Crear instancia de Hono
- Configurar rutas importadas
- Iniciar servidor
- Mostrar información de inicio

**Flujo:**
1. Importar dependencias
2. Crear app de Hono
3. Configurar rutas con `setupRoutes()`
4. Exportar config para Bun

### 🎨 `src/public/`
**Propósito:** Archivos del frontend

**Archivos:**
- `index.html` - UI completa de la aplicación
- `styles.css` - Sistema de temas (dark/light)
- `main.js` - (Opcional) JavaScript del cliente

**Características:**
- Diseño responsivo mobile-first
- Tema automático según sistema
- Accesibilidad (WCAG AA)
- Interacciones con API via fetch

## Flujo de Datos

### Acortar URL

```
Usuario (Browser)
    ↓ POST /api/short
routes.js
    ↓ isValidURL()
    ↓ generateShortCode()
db.js
    ↓ insertURL()
SQLite (urls.db)
    ↑ registro insertado
routes.js
    ↑ JSON response
Usuario (Browser)
```

### Redirección

```
Usuario (Browser)
    ↓ GET /:code
routes.js
    ↓ getURLByShortCode()
db.js
    ↓ SELECT query
SQLite (urls.db)
    ↑ original_url
routes.js
    ↑ redirect 301
Usuario (Browser) → URL Original
```

## Principios de Diseño

### ✅ Simplicidad
- Sin capas innecesarias (no services, no repositories)
- Arquitectura plana y directa
- Código fácil de entender

### ✅ Separación de Responsabilidades
- Configuración separada del código
- Rutas separadas de lógica de servidor
- Base de datos como módulo independiente

### ✅ Mantenibilidad
- Archivos pequeños y enfocados
- Comentarios claros y concisos
- Funciones con una sola responsabilidad

### ✅ Escalabilidad (preparada)
- Fácil agregar nuevas rutas en `routes.js`
- Fácil agregar nuevas queries en `db.js`
- Estructura permite crecer sin reescribir

## Convenciones de Código

### Imports
```javascript
// Orden: externos → internos → relativos
import { Hono } from "hono";
import { config } from "../config/env.js";
import { getAllURLs } from "./db.js";
```

### Funciones
```javascript
/**
 * Descripción breve de la función
 * @param {tipo} nombre - Descripción del parámetro
 * @returns {tipo} Descripción del retorno
 */
function nombreFuncion(parametro) {
  // implementación
}
```

### Exportaciones
```javascript
// Exports nombrados (preferido)
export function miFuncion() {}
export const miConstante = {};

// Export default solo para config principal
export default app;
```

## Extensiones Futuras

### Agregar Contador de Visitas
1. Modificar `db.js`: agregar columna `visit_count`
2. Modificar ruta `GET /:code` en `routes.js`: incrementar contador
3. Agregar endpoint `GET /api/stats` para estadísticas

### Agregar Autenticación
1. Crear `src/server/auth.js` con middleware
2. Aplicar middleware en rutas protegidas
3. Actualizar frontend con login

### Agregar Tests
```
tests/
├── unit/
│   ├── db.test.js
│   └── routes.test.js
└── integration/
    └── api.test.js
```

## Notas Técnicas

### ¿Por qué JavaScript y no TypeScript?
- Proyecto pequeño, JS es suficiente
- Menos complejidad de build
- Bun ejecuta JS nativamente
- Fácil migrar a TS en el futuro si crece

### ¿Por qué no separar en más capas?
- Arquitectura adecuada al tamaño del proyecto
- Evita over-engineering
- Más fácil de entender para nuevos desarrolladores
- Permite crecer orgánicamente

### Base de Datos
- SQLite es adecuado para este uso
- Para alta concurrencia, considerar PostgreSQL
- La estructura permite cambiar DB fácilmente

## Referencias

- [Hono Documentation](https://hono.dev/)
- [Bun Documentation](https://bun.sh/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
