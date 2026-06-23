import { redisClient } from '../config/redis.js';

const CACHE_TTL_SEGUNDOS = Number(process.env.CACHE_TTL_SEGUNDOS ?? 60);

const getCache = async (key) => {
  try {
    if (!redisClient.isOpen) return null;

    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.log('Cache get error:', err.message);
    return null;
  }
};

const setCache = async (key, value) => {
  try {
    if (!redisClient.isOpen) return;

    await redisClient.set(key, JSON.stringify(value), {
      EX: CACHE_TTL_SEGUNDOS,
    });
  } catch (err) {
    console.log('Cache set error:', err.message);
  }
};

const deleteCache = async (...keys) => {
  try {
    if (!redisClient.isOpen || keys.length === 0) return;

    await redisClient.del(keys);
  } catch (err) {
    console.log('Cache delete error:', err.message);
  }
};

export { getCache, setCache, deleteCache };
