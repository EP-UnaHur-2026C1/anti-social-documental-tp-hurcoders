import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import connectToDatabase from './src/config/db.js';
import { connectRedis } from './src/config/redis.js';

import userRoutes from './src/routes/users.route.js';
import postRoutes from './src/routes/posts.route.js';
import tagRoutes from './src/routes/tags.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UnaHur Anti-Social Net API',
      version: '1.0.0',
      description: 'API para red social - Trabajo Practico',
    },
    servers: [
      { url: 'http://localhost:3000' }
    ],
  },
  apis: ['./src/docs/*.yaml'],
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', express.static(path.join(__dirname, 'src/swagger-ui')));

app.get('/', (req, res) => {
  res.json({ message: 'UnaHur - Anti-Social net - Trabajo Practico (MongoDB + Mongoose)' });
});

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/tags', tagRoutes);

connectToDatabase().then(async () => {
  try {
    await connectRedis();
  } catch (err) {
    console.log('Redis no disponible, la API sigue sin cache:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
