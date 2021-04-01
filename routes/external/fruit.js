const Router = require('express-promise-router');
const axios = require('axios');

const router = new Router();

module.exports = router;

router.get('/', async (req, res) => {
  try {
    const fruit = await axios.get(`https://www.fruityvice.com/api/fruit/${req.query.fruitInput}`);
    res.status(200).send(fruit.data);
  } catch (error) {
    res.status(200).send({ name: undefined, nutritions: { sugar: undefined } });
  }
});
