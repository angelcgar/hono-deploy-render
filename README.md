# 🔗 Acortador de URLs

Acortador de URLs simple y funcional construido con Bun, Hono.js y SQLite.

## 🚀 Tecnologías

- **Runtime**: [Bun](https://bun.sh) - JavaScript runtime ultra rápido
- **Framework**: [Hono.js](https://hono.dev) - Framework web ligero y rápido
- **Base de datos**: SQLite - Base de datos embebida sin configuración
- **UI**: HTML, CSS y JavaScript vanilla

## 📁 Estructura del Proyecto

```
.
├── src/
│   ├── server/           # Backend del servidor
│   │   ├── index.js      # Punto de entrada
│   │   ├── routes.js     # Definición de rutas
│   │   └── db.js         # Base de datos SQLite
│   ├── public/           # Frontend estático
│   │   ├── index.html    # Interfaz de usuario
│   │   └── styles.css    # Estilos CSS (dark/light mode)
│   └── config/           # Configuración
│       └── env.js        # Variables de entorno
├── docs/                 # Documentación
│   ├── database.md       # Esquema de base de datos
│   └── ARCHITECTURE.md   # Arquitectura del proyecto
├── .env.example          # Ejemplo de variables de entorno
├── package.json          # Dependencias y scripts
├── urls.db              # Base de datos SQLite (generada)
└── README.md            # Este archivo
```

Ver [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) para detalles completos de la arquitectura.

## ⚙️ Características

✅ Acorta URLs largas en códigos de 6 caracteres
✅ Almacenamiento persistente en SQLite
✅ **Tema oscuro/claro automático** según preferencias del sistema
✅ **UI accesible** (WCAG AA, navegación por teclado, ARIA)
✅ **Diseño responsivo** mobile-first
✅ Lista de URLs creadas en tiempo real
✅ **Icono de copiar junto a cada URL** con feedback visual
✅ Redirección automática
✅ Validación de URLs
✅ **Variables de entorno** para PORT y BASE_URL
✅ **Respeta `prefers-reduced-motion`** para accesibilidad## 🛠️ Instalación y Ejecución

### Prerrequisitos

- [Bun](https://bun.sh) instalado en tu sistema

### Pasos

1. **Clonar el repositorio** (opcional):
```bash
git clone <repo-url>
cd hono-deploy-render
```

2. **Instalar dependencias**:
```bash
bun install
```

3. **(Opcional) Configurar variables de entorno**:
```bash
cp .env.example .env
# Editar .env si necesitas cambiar PORT o BASE_URL
```

4. **Ejecutar el servidor**:
```bash
bun run dev
```

O para producción:
```bash
bun start
```

5. **Abrir en el navegador**:
```
http://localhost:3000
```

## 🔧 Variables de Entorno

El proyecto soporta las siguientes variables de entorno (todas opcionales):

| Variable   | Por defecto             | Descripción                         |
| ---------- | ----------------------- | ----------------------------------- |
| `PORT`     | `3000`                  | Puerto donde se ejecuta el servidor |
| `BASE_URL` | `http://localhost:3000` | URL base para las URLs acortadas    |

**Ejemplo de uso en producción:**
```bash
PORT=8080 BASE_URL=https://short.ly bun start
```

## 📡 API Endpoints

### `GET /`
Sirve la interfaz de usuario HTML.

### `GET /api/urls`
Obtiene todas las URLs acortadas.

**Response**:
```json
[
  {
    "id": 1,
    "original_url": "https://ejemplo.com/url-larga",
    "short_code": "abc123",
    "created_at": "2026-01-01T12:00:00.000Z"
  }
]
```

### `POST /api/short`
Crea una nueva URL acortada.

**Request**:
```json
{
  "url": "https://ejemplo.com/url-muy-larga"
}
```

**Response**:
```json
{
  "success": true,
  "short_url": "http://localhost:3000/abc123",
  "short_code": "abc123",
  "original_url": "https://ejemplo.com/url-muy-larga",
  "created_at": "2026-01-01T12:00:00.000Z"
}
```

### `GET /:short_code`
Redirecciona a la URL original.

**Ejemplo**: Visitar `http://localhost:3000/abc123` te redirige a la URL original.

## 💾 Base de Datos

El proyecto usa SQLite con la siguiente estructura:

### Tabla `urls`
| Campo          | Tipo    | Descripción                       |
| -------------- | ------- | --------------------------------- |
| `id`           | INTEGER | ID autoincremental (PRIMARY KEY)  |
| `original_url` | TEXT    | URL original completa             |
| `short_code`   | TEXT    | Código corto único (6 caracteres) |
| `created_at`   | TEXT    | Timestamp de creación             |

## 🎨 Interfaz de Usuario

La UI incluye un **diseño dark mode moderno** con:
- **Formulario**: Para ingresar URLs largas
- **Botón de acortar**: Procesa la URL y genera el código corto
- **Resultado**: Muestra la URL acortada con botón de copiar
- **Lista**: Muestra todas las URLs creadas con:
  - URL original
  - URL acortada (clickeable)
  - **Icono SVG para copiar** cada URL individualmente (accesible por teclado)
  - Fecha de creación

### Sistema de Temas
- **Automático**: Detecta preferencias del sistema (`prefers-color-scheme`)
- **Tema oscuro**: Por defecto, colores optimizados para bajo contraste lumínico
- **Tema claro**: Se activa automáticamente si el sistema está en modo claro
- Sin JavaScript, solo CSS

### Paleta de colores
**Tema Oscuro:**
- Fondo principal: `#0f1115`
- Fondo secundario: `#161a21`
- Texto principal: `#e6e6eb`
- Texto secundario: `#9aa0aa`
- Color de acento: `#4f8cff`
- Color de éxito: `#3ddc97`

**Tema Claro:**
- Fondo principal: `#ffffff`
- Fondo secundario: `#f5f7fa`
- Texto principal: `#1a1d23`
- Texto secundario: `#5a6270`
- Acentos mantienen consistencia

### Accesibilidad
- ✅ Contraste WCAG AA en todos los elementos
- ✅ Navegación completa por teclado (Tab, Enter, Espacio)
- ✅ ARIA labels en iconos interactivos
- ✅ Focus visible en todos los elementos
- ✅ Tamaños táctiles mínimos de 44px
- ✅ Respeta `prefers-reduced-motion`

Ver [ACCESSIBILITY.md](./ACCESSIBILITY.md) para detalles completos.

## 🔧 Desarrollo

### Scripts disponibles

```bash
# Modo desarrollo con hot-reload
bun run dev

# Modo producción
bun start
```

### Personalización

- **Puerto**: Usar variable de entorno `PORT` o editar en `src/config/env.js`
- **BASE_URL**: Usar variable de entorno `BASE_URL` para URLs de producción
- **Longitud del código**: Modificar `codeLength` en `generateShortCode()` (`src/server/routes.js`)
- **Estilos**: Editar variables CSS en `src/public/styles.css` (`:root`)
- **Colores**: Cambiar la paleta en las variables CSS del archivo `styles.css`

## 📝 Notas Técnicas

- Los códigos cortos se generan aleatoriamente y se verifican para evitar duplicados
- SQLite crea automáticamente la base de datos `urls.db` en la primera ejecución
- Las URLs se validan para asegurar que tengan protocolo `http://` o `https://`
- La UI se actualiza dinámicamente sin recargar la página
- Arquitectura simple y escalable, ver [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- Esquema de base de datos documentado en [docs/database.md](./docs/database.md)

## 🔒 Seguridad

⚠️ **Este proyecto es solo para uso local y desarrollo**. Para producción considera:
- Validación más estricta de URLs
- Límite de tasa (rate limiting)
- Sanitización de entradas
- HTTPS obligatorio
- Base de datos externa

## 📚 Documentación Adicional

- [Arquitectura del Proyecto](./docs/ARCHITECTURE.md) - Estructura y flujo de datos
- [Base de Datos](./docs/database.md) - Esquema y operaciones SQLite
- [Accesibilidad](./ACCESSIBILITY.md) - Guía de a11y y testing
- [Cambios Recientes](./CHANGES.md) - Historial de refactorizaciones

## 📄 Licencia

Proyecto de demostración - Uso libre para aprendizaje.
