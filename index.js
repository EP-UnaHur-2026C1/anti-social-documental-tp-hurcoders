require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./src/config/db');

const userRoutes = require('./src/routes/users.route');
const postRoutes = require('./src/routes/posts.route');

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
