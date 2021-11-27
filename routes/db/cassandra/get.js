import Router from '@koa/router';

import User from '../../../db/cassandra/models/User.js';

const router = new Router({ prefix: '/get' });

router.get('/', async (context) => {
  try {
    const results = await User.find({
      birthday: context.request.query.birthday,
      fruit: context.request.query.fruit,
      animal: context.request.query.animal,
    });
    context.response.status = 200;
    context.response.body = results;
  } catch (error) {
    console.error('error with get', error);
    context.response.status = 200;
  }
});

export default router;
