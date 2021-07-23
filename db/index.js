import mongoose from 'mongoose';

const mongoURI = 'mongodb://127.0.0.1:27017/myspace';

const db = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

db.then(() => console.log(`Connected to: ${mongoURI}`)).catch((error) => {
  console.error(
    `There was a problem connecting to mongo at: ${mongoURI}`,
    error,
  );
});

export default db;
