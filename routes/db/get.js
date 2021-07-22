import Router from '@koa/router';
import Name from '../../db/models/Name.js';

const router = new Router({ prefix: '/get' });

router.get('/', async (req, res) => {
  try {
    const results = await Name.find({
      birthday: req.query.birthday,
      fruit: req.query.fruit,
      animal: req.query.animal,
    });
    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(200).send(false);
  }
});

export default router;
