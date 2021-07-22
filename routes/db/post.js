import Router from '@koa/router';
import Name from '../../db/models/Name.js';

const router = new Router({ prefix: '/post' });

router.post('/', async (req, res) => {
  try {
    const newName = await new Name({
      emotion: req.body.emotion,
      normalEmotion: req.body.normalEmotion,
      emoEmotion: req.body.emoEmotion,
      animal: req.body.animal,
      petName: req.body.petName,
      birthday: req.body.birthday,
      fruit: req.body.fruit,
      sugar: req.body.sugar,
      result: req.body.result,
      mainResult: req.body.mainResult,
      emoResult: req.body.emoResult,
    });
    await newName.save();
    res.status(200).send('Saved');
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

export default router;
