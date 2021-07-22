import Router from '@koa/router';
import animalRouter from './external/animal.js';
import emotionRouter from './external/emotion.js';
import fruitRouter from './external/fruit.js';
import postRouter from './db/post.js';
import getRouter from './db/get.js';

const router = new Router({ prefix: '/submit' });

router.use(
  '/',
  animalRouter.routes(),
  animalRouter.allowedMethods(),
  emotionRouter.routes(),
  emotionRouter.allowedMethods(),
  fruitRouter.routes(),
  fruitRouter.allowedMethods(),
  postRouter.routes(),
  postRouter.allowedMethods(),
  getRouter.routes(),
  getRouter.allowedMethods(),
);

export default router;
