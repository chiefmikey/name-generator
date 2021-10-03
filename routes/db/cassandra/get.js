/* eslint-disable no-param-reassign */
import Router from '@koa/router';
import User from '../../../db/cassandra/models/User.js';

const router = new Router({ prefix: '/get' });

router.get('/', async (ctx) => {
  try {
    const results = await User.find({
      birthday: ctx.request.query.birthday,
      fruit: ctx.request.query.fruit,
      animal: ctx.request.query.animal,
    });
    ctx.response.status = 200;
    ctx.response.body = results;
  } catch (error) {
    console.error('error with get', error);
    ctx.response.status = 200;
  }
});

export default router;
