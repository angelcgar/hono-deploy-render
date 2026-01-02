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
├── db.ts              # Módulo de base de datos SQLite
├── index.ts           # Servidor Hono con rutas API
├── public/
│   └── index.html     # Interfaz de usuario
├── package.json       # Dependencias y scripts
├── tsconfig.json      # Configuración TypeScript
├── urls.db           # Base de datos SQLite (generada automáticamente)
└── README.md         # Este archivo
```

## ⚙️ Características

✅ Acorta URLs largas en códigos de 6 caracteres
✅ Almacenamiento persistente en SQLite
✅ Interfaz web responsive y moderna
✅ Lista de URLs creadas en tiempo real
✅ Copiar URL corta al portapapeles
✅ Redirección automática
✅ Validación de URLs

## 🛠️ Instalación y Ejecución

### Prerrequisitos

- [Bun](https://bun.sh) instalado en tu sistema

### Pasos

1. **Instalar dependencias**:
```bash
bun install
```

2. **Ejecutar el servidor**:
```bash
bun run dev
```

O para producción:
```bash
bun start
```

3. **Abrir en el navegador**:
```
http://localhost:3000
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

La UI incluye:
- **Formulario**: Para ingresar URLs largas
- **Botón de acortar**: Procesa la URL y genera el código corto
- **Resultado**: Muestra la URL acortada con botón de copiar
- **Lista**: Muestra todas las URLs creadas con fechas

## 🔧 Desarrollo

### Scripts disponibles

```bash
# Modo desarrollo con hot-reload
bun run dev

# Modo producción
bun start
```

### Personalización

- **Puerto**: Cambiar `PORT` en `index.ts` (línea 12)
- **Longitud del código**: Modificar `codeLength` en `generateShortCode()` (línea 17)
- **Estilos**: Editar el CSS en `public/index.html`

## 📝 Notas Técnicas

- Los códigos cortos se generan aleatoriamente y se verifican para evitar duplicados
- SQLite crea automáticamente la base de datos `urls.db` en la primera ejecución
- Las URLs se validan para asegurar que tengan protocolo `http://` o `https://`
- La UI se actualiza dinámicamente sin recargar la página

## 🔒 Seguridad

⚠️ **Este proyecto es solo para uso local y desarrollo**. Para producción considera:
- Validación más estricta de URLs
- Límite de tasa (rate limiting)
- Sanitización de entradas
- HTTPS obligatorio
- Base de datos externa

## 📄 Licencia

Proyecto de demostración - Uso libre para aprendizaje.
