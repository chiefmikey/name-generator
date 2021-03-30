const animal = require('./animal.js');
const emo = require('./emo.js');

module.exports = (app) => {
  app.use('/qa/questions', questions);
  app.use('/qa/questions/:question_id/answers', answers);
  app.use('/qa/answers/:answer_id', answers);
};
