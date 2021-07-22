import Router from '@koa/router';
import axios from 'axios';

const router = new Router({ prefix: '/emotion' });

router.get('/', async (ctx) => {
  try {
    const emotion = await axios.get(
      'https://api.datamuse.com/words?ml=enthusiastic',
    );
    ctx.response.status(200).send(emotion.data);
  } catch (error) {
    ctx.response.status(200).send([{ word: 'chief' }]);
  }
});

router.get('/emo', async (ctx) => {
  try {
    const emotion = await axios.get('https://api.datamuse.com/words?ml=sad');
    ctx.response.status(200).send(emotion.data);
  } catch (error) {
    ctx.response.status(200).send([{ word: 'chief' }]);
  }
});

export default router;
