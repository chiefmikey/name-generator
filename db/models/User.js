import cassandra from 'cassandra-driver';
import client from '../index.js';

const { Mapper } = cassandra.mapping;

const mappingOptions = {
  models: {
    User: {
      tables: ['users'],
      columns: {
        emotion: 'emotion',
        normalEmotion: 'normalEmotion',
        emoEmotion: 'emoEmotion',
        animal: 'animal',
        petName: 'petName',
        birthday: 'birthday',
        fruit: 'fruit',
        sugar: 'sugar',
        mainResult: 'mainResult',
        emoResult: 'emoResult',
      },
    },
  },
};

const mapper = new Mapper(client, mappingOptions);

const User = mapper.forModel('User');

export default User;

// import mongoose from 'mongoose';

// const nameSchema = new mongoose.Schema({
//   emotion: String,
//   normalEmotion: String,
//   emoEmotion: String,
//   animal: String,
//   petName: String,
//   birthday: String,
//   fruit: String,
//   sugar: String,
//   mainResult: String,
//   emoResult: String,
// });

// const Name = mongoose.model('Name', nameSchema);

// export default Name;
