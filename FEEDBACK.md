# Feedback del Trabajo Práctico (TP2 — MongoDB)

## Integrantes

A partir de los commits del repositorio:

- **Giuliano Brumatti** (`giulianonicolasbrumatti-maker`)
- **Rocío Alaniz** (`RoAAlaniz`)
- **Marcelo Díaz** (`marcelofabiandiaz-unahur`)

> Trabajo repartido entre los integrantes del equipo. 👏

---

## Resumen General

¡Buen trabajo! 🎉 La entrega tiene un **modelado documental muy prolijo y bien documentado** (imágenes embebidas, una colección intermedia `PostTag` para el muchos-a-muchos, comentarios referenciados), validación con **Joi**, validación de `ObjectId`, caché con Redis, y una experiencia de desarrollo cuidada (arranca con `mongodb-memory-server` sin instalar nada). La documentación (Swagger + Postman + `instrucciones.md` + diagrama) es de las mejores del conjunto.

El punto a resolver —importante— es que la **regla de los comentarios antiguos quedó escrita pero no conectada**: hoy los comentarios viejos se siguen mostrando. Es un ajuste chico, porque la lógica del filtro ya existe.

### Estado por criterio

| Criterio        | Estado | Comentario breve |
|-----------------|:------:|------------------|
| Arquitectura    |   ✅   | Capas claras; controladores con responsabilidades acotadas. |
| Modelado        |   ✅   | Documental coherente (`PostTag` intermedio); `nickName` único. |
| Validaciones    |   ✅   | Joi + validación de `ObjectId`; integridad referencial al crear. |
| Middlewares     |   ✅   | `validateObjectId` y `existeMiddleware` reutilizables. |
| API REST        |   ⚠️   | CRUD + relaciones; el upload por archivo no funciona (Obs. 3). |
| Configuración   |   ⚠️   | Falta `COMMENT_VISIBILITY_MONTHS` en `.env` (Obs. 2). |
| Documentación   |   ✅   | Swagger, Postman, instrucciones, `mongodb-memory-server`. |

---

## Fortalezas

### 1. Modelado documental coherente y documentado 🗃️
**Ubicación:** `src/models/`

Decidieron muy bien qué embeber y qué referenciar: imágenes **embebidas** en el `Post`, comentarios **referenciados**, y la relación Post↔Tag resuelta con una colección intermedia **`PostTag`** (con índice único `{postId, tagId}` para evitar duplicados). Además, cada modelo tiene comentarios que explican la decisión. `nickName` es único. 👌

### 2. Validación de `ObjectId` e integridad referencial ♻️🛡️
**Ubicación:** `src/middlewares/validateObjectId.js`, `src/controllers/posts.controller.js`

Validan el formato de `ObjectId` en middlewares y verifican existencia de recursos (por ejemplo, que el usuario exista al crear un post/comentario, o el tag al asociarlo). Validan los cuerpos con **Joi** (lo recomendado).

### 3. Experiencia de desarrollo y documentación 📚
**Ubicación:** `src/config/db.js`, `docs/`, `postman_collection.json`, `instrucciones.md`

Si `MONGO_URL` está vacía, levantan una base en memoria con `mongodb-memory-server` (cero configuración para probar). Sumaron Swagger, colección de Postman, instrucciones y un diagrama. Muy buena cobertura.

### 4. Caché con Redis (tolerante a fallos) 🚀
**Ubicación:** `src/utils/cache.js`, `src/utils/postCache.js`

Cachean las lecturas de posts e invalidan al crear/editar/eliminar; si Redis no está disponible, la API sigue funcionando. Bonus bien resuelto.

---

## Observaciones

### 1. La regla de los comentarios antiguos no oculta los comentarios viejos

**Estado:** ❌  **Severidad:** 🔴 Crítico
**Ubicación:** `src/controllers/posts.controller.js` (`getPosts`, `getPostById`, `buildPosts`), `src/controllers/comments.controller.js` (`getCommentsByPost`)

**Descripción:**
La lógica del filtro existe (`getVisibilityCutoff` y `buildPosts`, que filtra `commentDate >= cutoff`), pero **no se usa**:

- `buildPosts` está definido pero **nunca se invoca** (es código muerto).
- `getPosts` y `getPostById` traen los comentarios con `Comment.find({ postId... })` **sin** la condición de fecha, así que devuelven todos.
- `getCommentsByPost` solo agrega un flag `isVisible`, pero igualmente **devuelve** los comentarios viejos.

**Impacto:**
El enunciado pide que los comentarios más antiguos que X meses **no se muestren** en la visualización de los posts. Hoy se muestran (en el post, sin filtrar; en el endpoint de comentarios, marcados pero presentes). Es la regla de negocio central.

**Recomendación:**
Aplicar el corte en la consulta. Ya tienen todo lo necesario: usar `buildPosts` en `getPosts`/`getPostById`, o agregar `commentDate: { $gte: cutoff }` a los `Comment.find(...)`, y en `getCommentsByPost` **filtrar** en lugar de solo marcar:

```js
const comments = await Comment.find({ postId: req.params.postId, commentDate: { $gte: cutoff } })...
```

---

### 2. `COMMENT_VISIBILITY_MONTHS` no está en el `.env`

**Estado:** ⚠️  **Severidad:** 🟠 Importante
**Ubicación:** `.env`, `src/controllers/posts.controller.js` / `comments.controller.js`

**Descripción:**
El código lee `process.env.COMMENT_VISIBILITY_MONTHS` (con default 6), pero esa variable **no está declarada** en el `.env` (que solo trae `PORT`, `MONGO_URL` y la config de Redis).

**Impacto:**
Aun cuando conecten el filtro, el umbral no será configurable como pide el enunciado: siempre quedará en 6.

**Recomendación:**
Agregar `COMMENT_VISIBILITY_MONTHS=6` al `.env` (y al `.env.example`).

---

### 3. El endpoint de upload por archivo no funciona (falta `multer`)

**Estado:** ⚠️  **Severidad:** 🟡 Mejora recomendada
**Ubicación:** `src/controllers/posts.controller.js` (`uploadImagePost`)

**Descripción:**
`uploadImagePost` usa `req.file`, pero `multer` no está entre las dependencias ni cableado en las rutas, así que `req.file` siempre será `undefined` y la ruta responde “No se ha subido ningún archivo”. (La carga de imágenes **por URL** —`addImagePost`— sí funciona, que es el requisito base.)

**Impacto:**
El bonus de upload por archivo no está operativo. No afecta el MVP, porque las imágenes por URL ya cumplen el requerimiento.

**Recomendación:**
Si quieren el bonus, instalar `multer` y agregar el middleware `upload.single('image')` en la ruta correspondiente; si no, quitar `uploadImagePost` para evitar confusión.

---

## Conclusión

Es una entrega con un modelado muy bien pensado, validaciones con Joi, caché tolerante a fallos y una documentación/experiencia de desarrollo excelentes. 🌟

Lo principal es **conectar la regla de los comentarios** (ya tienen el filtro escrito, solo falta usarlo) y exponer su variable de entorno. Con ese cambio —chico— el trabajo queda muy redondo. ¡Felicitaciones por la prolijidad! 🚀
