import redis from 'redis';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || undefined,
  socket: {
    connectTimeout: 10000,
    reconnectStrategy: false,
  },
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error:', err.message);
});

redisClient.on('connect', () => {
  console.log('Redis conectado OK');
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export { redisClient, connectRedis };
