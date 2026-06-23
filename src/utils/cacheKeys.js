const cacheKeys = {
  postsList: 'posts:list',
  postById: (id) => `posts:byId:${id}`,
};

export default cacheKeys;
