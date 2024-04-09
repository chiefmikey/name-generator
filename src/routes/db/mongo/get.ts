import Router from '@koa/router';

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
    console.log(error);
    context.response.status = 200;
    context.response.body = false;
  }
});

export default router;
