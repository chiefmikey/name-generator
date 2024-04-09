import Router from '@koa/router';
import axios from 'axios';

const router = new Router({ prefix: '/fruit' });

router.get('/', async (context) => {
  try {
    const fruit = await axios.get(
      `https://www.fruityvice.com/api/fruit/${context.request.query.fruitInput}`,
    );
    context.response.status = 200;
    context.response.body = fruit.data;
  } catch {
    context.response.status = 200;
    context.response.body = {
      name: undefined,
      nutritions: { sugar: undefined },
    };
  }
});

export default router;
