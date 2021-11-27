import Router from '@koa/router';

import getMongoRouter from './db/mongo/get.js';
import postMongoRouter from './db/mongo/post.js';
import animalRouter from './external/animal.js';
import emotionRouter from './external/emotion.js';
import fruitRouter from './external/fruit.js';
// import postCassandraRouter from './db/cassandra/post.js';
// import getCassandraRouter from './db/cassandra/get.js';

const router = new Router({ prefix: '/submit' });

router.use(
  animalRouter.routes(),
  animalRouter.allowedMethods(),
  emotionRouter.routes(),
  emotionRouter.allowedMethods(),
  fruitRouter.routes(),
  fruitRouter.allowedMethods(),
  postMongoRouter.routes(),
  postMongoRouter.allowedMethods(),
  getMongoRouter.routes(),
  getMongoRouter.allowedMethods(),
  // postCassandraRouter.routes(),
  // postCassandraRouter.allowedMethods(),
  // getCassandraRouter.routes(),
  // getCassandraRouter.allowedMethods(),
);

export default router;
