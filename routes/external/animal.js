const Router = require('express-promise-router');
const axios = require('axios');
const auth = require('../../token.js');

const router = new Router();

module.exports = router;

router.get('/', async (req, res) => {
  try {
    const authorize = await auth.animalAccess();
    // console.log(authorize.animalTokenType);
    const allAnimals = {
      method: 'get',
      url: `https://api.petfinder.com/v2/animals?type=${req.query.defaultAnimal}&after=2020-${req.query.defaultBirthday}T00:00:00Z&before=2020-${req.query.defaultBirthday}T23:59:59Z`,
      headers: {
        Authorization: `${authorize.animalTokenType} ${authorize.animalToken}`,
      },
    };
    const animalResults = await axios(allAnimals);
    // console.log(animalResults.data.animals);
    const selectAnimal = animalResults.data.animals[
      Math.floor(Math.random() * animalResults.data.animals.length)
    ];
    // console.log(animalResults.data.animals);
    res.status(200).send(selectAnimal);
  } catch (error) {
    res.status(200).send({ name: 'mikey' });
  }
});
