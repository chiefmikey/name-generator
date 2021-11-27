import Router from '@koa/router';
import axios from 'axios';

const router = new Router({ prefix: '/emotion' });

router.get('/', async (context) => {
  try {
    const emotion = await axios.get(
      'https://api.datamuse.com/words?ml=enthusiastic',
    );
    context.response.status = 200;
    context.body = emotion.data;
  } catch {
    context.response.status = 200;
    context.body = { word: 'chief' };
  }
});

router.get('/emo', async (context) => {
  try {
    const emotion = await axios.get('https://api.datamuse.com/words?ml=sad');
    context.response.status = 200;
    context.body = emotion.data;
  } catch {
    context.response.status = 200;
    context.response.body = { word: 'chief' };
  }
});

export default router;
