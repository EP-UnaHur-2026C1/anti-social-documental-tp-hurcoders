import mongoose from 'mongoose';

let memoryServer = null;

const connectToDatabase = async () => {
  try {
    let url = process.env.MONGO_URL;

    if (!url) {
      const { MongoMemoryServer } = await import('mongodb-memory-server');

      memoryServer = await MongoMemoryServer.create({
        binary: {
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

connectToDatabase.disconnect = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop({ doCleanup: false, force: false });
  }
};

export default connectToDatabase;
