import cacheKeys from './cacheKeys.js';
import { deleteCache } from './cache.js';

const invalidatePostCache = async (postId = null) => {
  const keys = [cacheKeys.postsList];

  if (postId) {
    keys.push(cacheKeys.postById(postId));
  }

  await deleteCache(...keys);
};

export default invalidatePostCache;
