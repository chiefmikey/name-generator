const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/myspace';

const db = mongoose.connect(mongoURI, { useNewUrlParser: true });

db
  .then((res) => console.log(`Connected to: ${mongoURI}`))
  .catch((error) => {
    console.error(`There was a problem connecting to mongo at: ${mongoURI}`, error);
  });

module.exports = db;
