import cassandra from 'cassandra-driver';
import client from '../index.js';

const { Mapper } = cassandra.mapping;

const mappingOptions = {
  models: {
    User: {
      tables: ['name'],
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

const mapper = new Mapper(client('user'), mappingOptions);

const User = mapper.forModel('User');

export default User;
