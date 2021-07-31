/* eslint-disable no-param-reassign */
import Router from '@koa/router';
import axios from 'axios';
import auth from '../../token.js';

const router = new Router({ prefix: '/animal' });

router.get('/', async (ctx) => {
  try {
    const authorize = await auth.animalAccess();
    const allAnimals = {
      method: 'get',
      url: `https://api.petfinder.com/v2/animals?type=${ctx.request.query.defaultAnimal}&after=2020-${ctx.request.query.defaultBirthday}T00:00:00Z&before=2020-${ctx.request.query.defaultBirthday}T23:59:59Z`,
      headers: {
        Authorization: `${authorize.animalTokenType} ${authorize.animalToken}`,
      },
    };
    const animalResults = await axios(allAnimals);
    const selectAnimal =
      animalResults.data.animals[
        Math.floor(Math.random() * animalResults.data.animals.length)
      ];
    ctx.response.status = 200;
    ctx.response.body = selectAnimal;
  } catch (error) {
    ctx.response.status = 200;
    ctx.response.body = { name: 'mikey' };
  }
});

export default router;
