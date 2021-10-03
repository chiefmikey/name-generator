import mongoose from 'mongoose';

const mongoURI = 'mongodb://name-generator_db:27017/namegenerator';

const db = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  // useCreateIndex: true,
});

db.then(() => console.log(`Connected to: ${mongoURI}`)).catch((error) => {
  console.error(
    `There was a problem connecting to mongo at: ${mongoURI}`,
    error,
  );
});

export default db;
