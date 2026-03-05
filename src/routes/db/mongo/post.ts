import Router from '@koa/router';

import User from '../../../db/mongo/models/User';

const router = new Router({ prefix: '/post' });

router.post('/', async (context) => {
  try {
    const addUser = await new User({
      animal: context.request.body.animal,
      birthday: context.request.body.birthday,
      emoEmotion: context.request.body.emoEmotion,
      emoResult: context.request.body.emoResult,
      emotion: context.request.body.emotion,
      fruit: context.request.body.fruit,
      mainResult: context.request.body.mainResult,
      normalEmotion: context.request.body.normalEmotion,
      petName: context.request.body.petName,
      sugar: context.request.body.sugar,
    });
    await addUser.save();
    context.response.status = 200;
    context.response.body = 'Saved';
  } catch (error) {
    console.error(error);
    context.response.status = 400;
    context.response.body = error;
  }
});

export default router;
