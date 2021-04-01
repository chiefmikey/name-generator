const animal = require('./external/animal.js');
const fruit = require('./external/fruit.js');
const emotion = require('./external/emotion.js');
const save = require('./external/save.js');

module.exports = (app) => {
  app.use('/submit/animal', animal);
  app.use('/submit/fruit', fruit);
  app.use('/submit/emotion', emotion);
  app.use('/submit/post', save.add);
  app.use('/submit/get', save.get);
};
