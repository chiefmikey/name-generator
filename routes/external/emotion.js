const Router = require('express-promise-router');
const axios = require('axios');
const auth = require('../../token.js');

const router = new Router();

module.exports = router;

router.get('/', async (req, res) => {
  try {
    const emotion = await axios.get(`https://api.datamuse.com/words?ml=enthusiastic`);
    res.status(200).send(emotion.data);
  } catch (error) {
    res.status(200).send([{ word: 'chief' }]);
  }
});

router.get('/emo', async (req, res) => {
  try {
    const emotion = await axios.get(`https://api.datamuse.com/words?ml=sad`);
    res.status(200).send(emotion.data);
  } catch (error) {
    res.status(200).send([{ word: 'chief' }]);
  }
});
