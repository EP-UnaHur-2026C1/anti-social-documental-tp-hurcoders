# Cómo levantar Anti-Social Net

## Requisitos previos

| Herramienta | Versión mínima | Necesaria para |
|-------------|---------------|----------------|
| Node.js | 20.x | Modo local |
| npm | 9.x | Modo local |
| Docker Desktop | Cualquier versión reciente | Modo Docker |

---

## Opción A — Modo local (`npm run dev`)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd anti-social-documental-tp-hurcoders
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo de ejemplo y renombralo a `.env`:

```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

El `.env` ya viene con valores por defecto listos para usar:

```env
PORT=3000

# Dejá MONGO_URL vacío para usar una base de datos en memoria automática.
# No necesitás instalar MongoDB.
MONGO_URL=

# Redis es opcional. Si no está disponible, la API funciona igual sin caché.
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=1qaz!QAZ
CACHE_TTL_SEGUNDOS=60
```

> **Nota sobre MongoDB:** si `MONGO_URL` está vacío, el proyecto levanta automáticamente una instancia de MongoDB en memoria (`mongodb-memory-server`). Los datos no persisten al reiniciar, pero es ideal para desarrollo sin instalar nada extra.

> **Nota sobre Redis:** si no tenés Redis corriendo localmente, la API sigue funcionando normalmente, solo sin caché.

### 4. Levantar el servidor

```bash
npm run dev
```

El servidor se inicia con `nodemon`, por lo que se recarga automáticamente ante cualquier cambio en el código.

### 5. Verificar que funciona

| URL | Descripción |
|-----|-------------|
| `http://localhost:3000` | Mensaje de bienvenida |
| `http://localhost:3000/api-docs` | Swagger UI |

---

## Opción B — Modo Docker

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd anti-social-documental-tp-hurcoders
```

### 2. Configurar variables de entorno

Igual que en modo local, el `.env` es necesario para que Docker pueda leer variables opcionales:

```bash
# Windows
copy .env.example .env

# Mac / Linux
cp .env.example .env
```

> En modo Docker **no hace falta modificar nada** del `.env`. Las variables de conexión a MongoDB y Redis las inyecta directamente el `docker-compose.yml` apuntando a los contenedores internos.

### 3. Levantar todos los servicios

```bash
docker compose up -d
```

### 4. Verificar que funciona

| URL | Descripción |
|-----|-------------|
| `http://localhost:3000` | Mensaje de bienvenida |
| `http://localhost:3000/api-docs` | Swagger UI |
| `http://localhost:8081` | Mongo Express (interfaz web de MongoDB) |
| `http://localhost:5540` | RedisInsight (interfaz web de Redis) |

#### Credenciales Mongo Express

| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `admin1234` |

#### Configurar RedisInsight (primera vez)

Al entrar por primera vez a `http://localhost:5540`, agregar la conexión manualmente:

- **Host:** `redis`
- **Puerto:** `6379`
- **Password:** `1qaz!QAZ`

### 5. Detener los servicios

```bash
docker compose down
```

Para detener **y eliminar los volúmenes** (borra todos los datos de MongoDB y Redis):

```bash
docker compose down -v
```

---

## Servicios que levanta Docker

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `app` | `3000` | API REST Node.js + Express |
| `mongo` | `27017` | Base de datos MongoDB 7 |
| `mongo-express` | `8081` | Interfaz web para MongoDB |
| `redis` | `6379` | Cache Redis |
| `redisinsight` | `5540` | Interfaz web para Redis |

---

## Resumen rápido

```bash
# Modo local
cp .env.example .env
npm install
npm run dev

# Modo Docker
cp .env.example .env
docker compose up --build
```
