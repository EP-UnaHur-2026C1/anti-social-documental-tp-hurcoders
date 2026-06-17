const mongoose = require('mongoose');

let memoryServer = null;

// Conecta a MongoDB.
// - Si MONGO_URL esta definido, usa esa instancia (local, Docker o Atlas) y los
//   datos persisten entre reinicios.
// - Si no, levanta una base en memoria (mongodb-memory-server) en el directorio
//   temporal del sistema, util para desarrollar sin instalar MongoDB ni Docker.
//   Nota: la base en memoria se reinicia con cada arranque.
const connectToDatabase = async () => {
  try {
    let url = process.env.MONGO_URL;

    if (!url) {
      const { MongoMemoryServer } = require('mongodb-memory-server');

      memoryServer = await MongoMemoryServer.create({
        binary: {
          // mongod 7.0.x: version estable que mongodb-memory-server parsea sin errores.
          version: '7.0.14',
        },
        instance: {
          dbName: 'antisocial',
        },
      });

      url = memoryServer.getUri('antisocial');
      console.log('MongoDB en memoria iniciado (sin instalar MongoDB).');
    }

    mongoose.set('strictQuery', false);
    await mongoose.connect(url);
    console.log('Conexion a mongo con exito');
  } catch (err) {
    console.error('Error al conectarse a mongo', err);
    throw err;
  }
};

// Cierra la conexion y, si corresponde, detiene la base en memoria.
connectToDatabase.disconnect = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop({ doCleanup: false, force: false });
  }
};

module.exports = connectToDatabase;
