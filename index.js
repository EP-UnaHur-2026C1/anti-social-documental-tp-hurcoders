import 'dotenv/config';
import express from 'express';
import connectToDatabase from './src/config/db.js';

import userRoutes from './src/routes/users.route.js';
import postRoutes from './src/routes/posts.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'UnaHur - Anti-Social net - Trabajo Practico (MongoDB + Mongoose)' });
});

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
