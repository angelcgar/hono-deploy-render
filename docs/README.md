# 🔗 Acortador de URLs - Documentación Completa

Acortador de URLs simple y funcional construido con **Bun**, **Hono.js** y **SQLite**.

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Tecnologías](#tecnologías)
3. [Características](#características)
4. [Instalación y Ejecución](#instalación-y-ejecución)
5. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
6. [Base de Datos](#base-de-datos)
7. [Endpoints de la API](#endpoints-de-la-api)
8. [Dashboard de Estadísticas](#dashboard-de-estadísticas)
9. [Testing](#testing)
10. [Variables de Entorno](#variables-de-entorno)
11. [Despliegue](#despliegue)

---

## Introducción

Este proyecto es un acortador de URLs completo con:
- **Backend TypeScript** usando Bun + Hono.js
- **Base de datos SQLite** embebida
- **UI moderna** con soporte dark/light mode automático
- **Dashboard de estadísticas** para análisis
- **Tests automatizados** con Bun test runner
- **Contador de visitas** para tracking

---

## 🚀 Tecnologías

| Tecnología      | Uso                             | Versión        |
| --------------- | ------------------------------- | -------------- |
| **Bun**         | Runtime JavaScript ultra rápido | Latest         |
| **Hono.js**     | Framework web minimalista       | 4.0+           |
| **TypeScript**  | Lenguaje con tipos estáticos    | 5+             |
| **SQLite**      | Base de datos embebida          | vía bun:sqlite |
| **HTML/CSS/JS** | Frontend vanilla sin frameworks | -              |

---

## ✨ Características

### Funcionalidades Core
- ✅ Acorta URLs largas en códigos de 6 caracteres alfanuméricos
- ✅ Almacenamiento persistente en SQLite
- ✅ Redirección automática con tracking
- ✅ Validación de URLs
- ✅ **Contador de visitas** por URL

### UI/UX
- ✅ **Tema oscuro/claro automático** (respeta `prefers-color-scheme`)
- ✅ **Accesibilidad WCAG AA**
  - Navegación completa por teclado
  - Atributos ARIA
  - Contraste de colores adecuado
  - Respeta `prefers-reduced-motion`
- ✅ **Diseño responsivo** mobile-first
- ✅ Icono de copiar con feedback visual

### Funcionalidades Avanzadas
- ✅ **Dashboard de estadísticas** (`/stats`)
  - Total de URLs creadas
  - Total de visitas
  - Tabla detallada con todas las URLs
- ✅ **Tests automatizados** (20 tests)
- ✅ **Variables de entorno** configurables
- ✅ **Script de reset de BD** con confirmación

---

## 🛠️ Instalación y Ejecución

### Prerrequisitos
```bash
# Instalar Bun (si no lo tienes)
curl -fsSL https://bun.sh/install | bash
```

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd hono-deploy-render

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

### Desarrollo
```bash
# Iniciar servidor en modo desarrollo (con hot reload)
bun run dev

# El servidor estará disponible en http://localhost:3000
```

### Producción
```bash
# Ejecutar en modo producción
bun run start
```

### Testing
```bash
# Ejecutar todos los tests
bun test

# Ejecutar tests en modo watch
bun test:watch
```

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
hono-deploy-render/
├── src/
│   ├── server/              # Backend TypeScript
│   │   ├── index.ts        # Punto de entrada del servidor
│   │   ├── routes.ts       # Definición de todas las rutas
│   │   ├── db.ts           # Gestión de base de datos
│   │   └── reset-db.sql    # Script SQL de reset
│   │
│   ├── public/             # Frontend estático
│   │   ├── index.html      # Página principal
│   │   ├── stats.html      # Dashboard de estadísticas
│   │   └── styles.css      # Estilos CSS unificados
│   │
│   ├── config/             # Configuración
│   │   └── env.ts          # Variables de entorno
│   │
│   └── tests/              # Tests automatizados
│       ├── db.test.ts      # Tests de base de datos
│       └── routes.test.ts  # Tests de rutas HTTP
│
├── scripts/                # Scripts auxiliares
│   └── reset-db.ts        # Helper para resetear BD
│
├── db/                     # Base de datos SQLite
│   ├── dev.sqlite         # BD de desarrollo
│   └── prod.sqlite        # BD de producción
│
├── docs/                   # Documentación
│   └── README.md          # Esta documentación
│
├── .env                    # Variables de entorno (no versionado)
├── .env.example           # Ejemplo de configuración
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración TypeScript
└── README.md              # Documentación principal
```

### Módulos Principales

#### 🔧 `src/config/env.ts`
**Propósito:** Centralizar configuración

**Exports:**
```typescript
{
  PORT: number,           // Puerto del servidor
  BASE_URL: string,       // URL base para enlaces cortos
  DB_PATH: string,        // Ruta a la BD (según NODE_ENV)
  DB_PATH_DEV: string,    // Ruta BD desarrollo
  DB_PATH_PROD: string    // Ruta BD producción
}
```

#### 🗄️ `src/server/db.ts`
**Propósito:** Gestión de base de datos

**Funciones exportadas:**
- `getAllURLs()` - Obtiene todas las URLs
- `getURLByShortCode(code)` - Busca por código
- `insertURL(url, code)` - Inserta nueva URL
- `shortCodeExists(code)` - Verifica existencia
- `incrementVisitCount(code)` - Incrementa contador
- `getStats()` - Obtiene estadísticas globales

**Interfaz URLRecord:**
```typescript
{
  id: number;
  original_url: string;
  short_code: string;
  created_at: string;
  visit_count: number;
}
```

#### 🛣️ `src/server/routes.ts`
**Propósito:** Definición de rutas y endpoints

**Rutas estáticas:**
- `GET /` - Página principal
- `GET /stats` - Dashboard de estadísticas
- `GET /styles.css` - Hoja de estilos

**Endpoints API:**
- `GET /api/urls` - Lista todas las URLs
- `GET /api/stats` - Estadísticas globales
- `POST /api/short` - Crear URL corta
- `GET /:short_code` - Redirección (con tracking)

**Utilidades internas:**
- `generateShortCode()` - Genera códigos únicos
- `isValidURL()` - Valida formato de URLs

#### 🚀 `src/server/index.ts`
**Propósito:** Punto de entrada del servidor

**Responsabilidades:**
- Crear instancia de Hono
- Configurar rutas
- Logging de inicio
- Exportar configuración para Bun

---

## 🗄️ Base de Datos

### Tecnología: SQLite

SQLite es una base de datos relacional embebida que:
- No requiere servidor separado
- Se almacena en archivos `.sqlite`
- Es ideal para aplicaciones pequeñas/medianas
- Proporciona transacciones ACID completas

### Estructura de la Tabla `urls`

| Columna        | Tipo    | Restricciones              | Descripción                  |
| -------------- | ------- | -------------------------- | ---------------------------- |
| `id`           | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único          |
| `original_url` | TEXT    | NOT NULL                   | URL original completa        |
| `short_code`   | TEXT    | UNIQUE, NOT NULL           | Código corto de 6 caracteres |
| `created_at`   | TEXT    | DEFAULT CURRENT_TIMESTAMP  | Fecha de creación            |
| `visit_count`  | INTEGER | DEFAULT 0                  | Contador de visitas          |

#### Índices
- **idx_short_code**: Optimiza búsquedas por código corto

#### Ejemplo de Registro
```json
{
  "id": 1,
  "original_url": "https://ejemplo.com/pagina-larga",
  "short_code": "aB3xY9",
  "created_at": "2026-01-02 10:30:00",
  "visit_count": 42
}
```

### Operaciones SQL

```sql
-- Crear URL
INSERT INTO urls (original_url, short_code)
VALUES ('https://ejemplo.com', 'abc123');

-- Buscar por código
SELECT * FROM urls WHERE short_code = 'abc123';

-- Incrementar visitas
UPDATE urls
SET visit_count = visit_count + 1
WHERE short_code = 'abc123';

-- Obtener estadísticas
SELECT COUNT(*) as total FROM urls;
SELECT SUM(visit_count) as total_visits FROM urls;
```

### Bases de Datos Separadas

El proyecto usa BDs separadas por entorno:
- **Desarrollo:** `./db/dev.sqlite` (via `DB_PATH_DEV`)
- **Producción:** `./db/prod.sqlite` (via `DB_PATH_PROD`)

Controlado por `NODE_ENV` en `env.ts`.

### Reset de Base de Datos

Para limpiar la base de datos (⚠️ **DESTRUCTIVO**):

```bash
# Con confirmación requerida
bun run scripts/reset-db.ts --confirm
```

---

## 🌐 Endpoints de la API

### `GET /api/urls`
Lista todas las URLs acortadas.

**Response:**
```json
[
  {
    "id": 1,
    "original_url": "https://ejemplo.com",
    "short_code": "abc123",
    "created_at": "2026-01-02 10:30:00",
    "visit_count": 5
  }
]
```

### `GET /api/stats`
Obtiene estadísticas globales.

**Response:**
```json
{
  "totalURLs": 10,
  "totalVisits": 127,
  "urls": [/* array de URLs ordenadas por visitas */]
}
```

### `POST /api/short`
Crea una URL acortada.

**Request Body:**
```json
{
  "url": "https://ejemplo.com/pagina-larga"
}
```

**Response (éxito):**
```json
{
  "success": true,
  "short_url": "http://localhost:3000/abc123",
  "short_code": "abc123",
  "original_url": "https://ejemplo.com/pagina-larga",
  "created_at": "2026-01-02 10:30:00"
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "URL inválida"
}
```

### `GET /:short_code`
Redirecciona a la URL original e incrementa el contador.

**Response:** HTTP 301 con header `Location`

**Error:** HTTP 404 si el código no existe

---

## 📊 Dashboard de Estadísticas

### Acceso
Disponible en: `http://localhost:3000/stats`

### Funcionalidades

#### Métricas Globales
- **URLs Creadas:** Total de URLs en el sistema
- **Visitas Totales:** Suma de todas las visitas

#### Tabla Detallada
Columnas:
- URL Original (truncada, enlace externo)
- URL Corta (código, enlace local)
- Visitas (resaltadas en verde)
- Fecha de creación

### Características UI
- ✅ Reutiliza los estilos de `styles.css`
- ✅ Soporte dark/light mode automático
- ✅ Responsive (tabla con scroll horizontal en móviles)
- ✅ Enlaces funcionales a URLs originales
- ✅ Iconos para mejor UX
- ✅ Botón "Volver al inicio"

---

## 🧪 Testing

### Test Runner
Usamos el **test runner nativo de Bun** (compatible con `bun:test`).

### Cobertura de Tests

#### Tests de Base de Datos (`src/tests/db.test.ts`)
- ✅ Inserción de URLs
- ✅ Recuperación por código
- ✅ Verificación de existencia
- ✅ Incremento de contador de visitas
- ✅ Obtención de todas las URLs
- ✅ Estadísticas globales

#### Tests de Rutas (`src/tests/routes.test.ts`)
- ✅ Endpoint `/api/stats` (formato JSON)
- ✅ Endpoint `/api/urls` (lista correcta)
- ✅ Endpoint `POST /api/short` (creación exitosa)
- ✅ Validación de URLs inválidas
- ✅ Redirección correcta (status 301)
- ✅ Error 404 para códigos inexistentes

### Ejecutar Tests

```bash
# Todos los tests
bun test

# Con watch mode
bun test:watch

# Test específico
bun test src/tests/db.test.ts
```

### Resultados Esperados
```
✓ 20 tests passed
✓ 44 expect() calls
```

---

## ⚙️ Variables de Entorno

### Archivo `.env`

```env
# Puerto del servidor
PORT=3000

# URL base para enlaces cortos (sin trailing slash)
BASE_URL=http://localhost:3000

# Rutas de base de datos
DB_PATH_DEV=./db/dev.sqlite
DB_PATH_PROD=./db/prod.sqlite

# Entorno (development | production)
NODE_ENV=development
```

### Variables Disponibles

| Variable       | Tipo   | Default               | Descripción         |
| -------------- | ------ | --------------------- | ------------------- |
| `PORT`         | number | 3000                  | Puerto del servidor |
| `BASE_URL`     | string | http://localhost:3000 | URL base para links |
| `DB_PATH_DEV`  | string | ./db/dev.sqlite       | BD desarrollo       |
| `DB_PATH_PROD` | string | ./db/prod.sqlite      | BD producción       |
| `NODE_ENV`     | string | development           | Entorno actual      |

### Uso en Código

```typescript
import { config } from "./config/env";

console.log(config.PORT);      // 3000
console.log(config.DB_PATH);   // Según NODE_ENV
```

---

## 🚀 Despliegue

### Render (Recomendado)

1. Conecta tu repositorio a Render
2. Configura el servicio:
   - **Build Command:** `bun install`
   - **Start Command:** `bun run start`
3. Variables de entorno:
   ```
   BASE_URL=https://tu-app.onrender.com
   NODE_ENV=production
   DB_PATH_PROD=./db/prod.sqlite
   ```

### Railway

Similar a Render, asegúrate de:
- Instalar Bun en el contenedor
- Configurar variables de entorno
- Persistir el directorio `./db/` (volumen)

### Consideraciones

- SQLite es adecuado para demos y bajo tráfico
- Para producción con alto tráfico, considera PostgreSQL
- El archivo `.sqlite` debe persistir entre deployments

---

## 📝 Notas Adicionales

### Contribuir
1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "Añade nueva funcionalidad"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### Licencia
MIT License

### Autor
[Tu nombre]

### Soporte
Para reportar issues o sugerencias, abre un issue en GitHub.

---

**Última actualización:** 2 de enero de 2026
