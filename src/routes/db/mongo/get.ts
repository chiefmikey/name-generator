import Router from '@koa/router';

import User from '../../../db/mongo/models/User';

const router = new Router({ prefix: '/get' });

router.get('/', async (context) => {
  try {
    const results = await User.find({
      animal: context.request.query.animal,
      birthday: context.request.query.birthday,
      fruit: context.request.query.fruit,
    });
    context.response.status = 200;
    context.response.body = results;
  } catch (error) {
    console.error(error);
    context.response.status = 200;
    context.response.body = false;
  }
});

export default router;
