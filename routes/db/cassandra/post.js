import Router from '@koa/router';

import User from '../../../db/cassandra/models/User.js';

const router = new Router({ prefix: '/post' });

router.post('/', async (context) => {
  try {
    await User.insert({
      emotion: context.request.body.emotion,
      normalEmotion: context.request.body.normalEmotion,
      emoEmotion: context.request.body.emoEmotion,
      animal: context.request.body.animal,
      petName: context.request.body.petName,
      birthday: context.request.body.birthday,
      fruit: context.request.body.fruit,
      sugar: context.request.body.sugar,
      mainResult: context.request.body.mainResult,
      emoResult: context.request.body.emoResult,
    });
    context.response.status = 200;
    context.response.body = 'Saved';
  } catch (error) {
    console.error('error in post', error);
    context.response.status = 400;
    context.response.body = error;
  }
});

export default router;
