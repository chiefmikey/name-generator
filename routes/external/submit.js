const Router = require('express-promise-router');
const axios = require('axios');
const save = require('./save.js');

const router = new Router();

module.exports = router;

router.post('/', async (req, res) => {
  try {
    save.add(req, res);
    res.status(200).send(fruit.data);
  } catch (error) {
    res.status(200).send({ name: undefined, nutritions: { sugar: undefined } });
  }
});
