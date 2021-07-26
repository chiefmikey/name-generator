/* eslint-disable no-param-reassign */
import Router from '@koa/router';
import Name from '../../db/models/Name.js';

const router = new Router({ prefix: '/post' });

router.post('/', async (ctx) => {
  try {
    const newName = await new Name({
      emotion: ctx.request.body.emotion,
      normalEmotion: ctx.request.body.normalEmotion,
      emoEmotion: ctx.request.body.emoEmotion,
      animal: ctx.request.body.animal,
      petName: ctx.request.body.petName,
      birthday: ctx.request.body.birthday,
      fruit: ctx.request.body.fruit,
      sugar: ctx.request.body.sugar,
      mainResult: ctx.request.body.mainResult,
      emoResult: ctx.request.body.emoResult,
    });
    await newName.save();
    ctx.response.status = 200;
    ctx.response.body = 'Saved';
  } catch (error) {
    console.log(error);
    ctx.response.status = 400;
    ctx.response.body = error;
  }
});

export default router;
