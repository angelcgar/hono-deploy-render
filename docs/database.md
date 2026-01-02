# Documentación de Base de Datos

## Base de Datos Utilizada

Este proyecto utiliza **SQLite** como base de datos embebida.

SQLite es una base de datos relacional ligera que:
- No requiere servidor separado
- Se almacena en un único archivo (`urls.db`)
- Es ideal para aplicaciones pequeñas y medianas
- Proporciona transacciones ACID completas

## Estructura de Tablas

### Tabla: `urls`

Almacena todas las URLs acortadas con su información asociada.

| Columna        | Tipo    | Restricciones              | Descripción                                        |
| -------------- | ------- | -------------------------- | -------------------------------------------------- |
| `id`           | INTEGER | PRIMARY KEY, AUTOINCREMENT | Identificador único de cada URL                    |
| `original_url` | TEXT    | NOT NULL                   | URL completa original proporcionada por el usuario |
| `short_code`   | TEXT    | UNIQUE, NOT NULL           | Código corto único de 6 caracteres alfanuméricos   |
| `created_at`   | TEXT    | DEFAULT CURRENT_TIMESTAMP  | Fecha y hora de creación del registro              |

#### Índices

- **idx_short_code**: Índice sobre la columna `short_code` para optimizar las búsquedas de redirección.

#### Ejemplo de Registro

```json
{
  "id": 1,
  "original_url": "https://ejemplo.com/una-url-muy-larga-que-quiero-acortar",
  "short_code": "aB3xY9",
  "created_at": "2026-01-01 12:34:56"
}
```

## Operaciones Principales

### Crear URL acortada
```sql
INSERT INTO urls (original_url, short_code)
VALUES ('https://ejemplo.com', 'abc123');
```

### Buscar URL por código
```sql
SELECT * FROM urls WHERE short_code = 'abc123';
```

### Listar todas las URLs
```sql
SELECT * FROM urls ORDER BY created_at DESC;
```

### Verificar existencia de código
```sql
SELECT COUNT(*) as count FROM urls WHERE short_code = 'abc123';
```

## Notas Técnicas

### Ubicación del Archivo
Por defecto, la base de datos se crea en la raíz del proyecto como `urls.db`.
Esta ubicación puede configurarse mediante la variable de entorno `DB_PATH`.

### Persistencia
Todos los datos persisten en disco. No se usa caché en memoria, garantizando que los datos no se pierdan al reiniciar el servidor.

### Concurrencia
SQLite maneja automáticamente el acceso concurrente mediante locks de archivo. Para aplicaciones con alto tráfico, considerar bases de datos más robustas (PostgreSQL, MySQL).

## Planificación Futura

### ⚠️ Funcionalidad Planificada: Contador de Visitas

En futuras versiones se planea agregar un **contador de visitas** para rastrear cuántas veces se ha accedido a cada URL acortada.

#### Cambios Propuestos

**Nueva columna en tabla `urls`:**

| Columna       | Tipo    | Restricciones | Descripción                                 |
| ------------- | ------- | ------------- | ------------------------------------------- |
| `visit_count` | INTEGER | DEFAULT 0     | Número de veces que se ha accedido a la URL |

**Operación adicional:**
```sql
-- Incrementar contador al acceder a una URL
UPDATE urls
SET visit_count = visit_count + 1
WHERE short_code = 'abc123';
```

**Beneficios:**
- Estadísticas de uso
- Identificar URLs populares
- Análisis de tráfico básico

**Nota:** Esta funcionalidad **NO está implementada actualmente**. Es solo una propuesta para desarrollo futuro.

## Migración y Backup

### Crear Backup
```bash
# Copiar el archivo de base de datos
cp urls.db urls.db.backup
```

### Restaurar Backup
```bash
# Reemplazar con el backup
cp urls.db.backup urls.db
```

### Exportar a SQL
```bash
# Usando sqlite3 CLI
sqlite3 urls.db .dump > backup.sql
```

### Importar desde SQL
```bash
sqlite3 urls.db < backup.sql
```

## Consideraciones de Seguridad

1. **Validación de URLs**: Las URLs se validan antes de almacenarlas (solo http/https)
2. **Inyección SQL**: Se usan queries preparadas (parameterized queries) para prevenir inyección SQL
3. **Códigos únicos**: Se verifica la unicidad de los códigos cortos antes de insertar

## Referencias

- [SQLite Official Documentation](https://www.sqlite.org/docs.html)
- [Bun SQLite Driver](https://bun.sh/docs/api/sqlite)
