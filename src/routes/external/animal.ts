import Router from '@koa/router';
import axios from 'axios';

import auth from '../../../token.js';

const router = new Router({ prefix: '/animal' });

router.get('/', async (context) => {
  try {
    const authorize = await auth.animalAccess();
    const defaultAnimal = String(context.request.query.defaultAnimal ?? '');
    const defaultBirthday = String(context.request.query.defaultBirthday ?? '');
    const allAnimals = {
      headers: {
        Authorization: `${authorize.animalTokenType} ${authorize.animalToken}`,
      },
      method: 'get',
      url: `https://api.petfinder.com/v2/animals?type=${defaultAnimal}&after=2020-${defaultBirthday}T00:00:00Z&before=2020-${defaultBirthday}T23:59:59Z`,
    };
    const animalResults = await axios(allAnimals);
    const selectAnimal =
      animalResults.data.animals[
        Math.floor(Math.random() * animalResults.data.animals.length)
      ];
    context.response.status = 200;
    context.response.body = selectAnimal;
  } catch {
    context.response.status = 200;
    context.response.body = { name: 'mikey' };
  }
});

export default router;
