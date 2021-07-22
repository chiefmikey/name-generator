import Router from '@koa/router';
import axios from 'axios';

const router = new Router({ prefix: '/fruit' });

router.get('/', async (ctx) => {
  try {
    const fruit = await axios.get(
      `https://www.fruityvice.com/api/fruit/${ctx.request.query.fruitInput}`,
    );
    ctx.response.status(200).send(fruit.data);
  } catch (error) {
    ctx.response
      .status(200)
      .send({ name: undefined, nutritions: { sugar: undefined } });
  }
});

export default router;
