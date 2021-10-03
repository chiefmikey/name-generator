import cassandra from 'cassandra-driver';
import client from '../index.js';

const { Mapper } = cassandra.mapping;
const { UnderscoreCqlToCamelCaseMappings } = cassandra.mapping;

const mappingOptions = {
  models: {
    User: {
      tables: ['name'],
      mappings: new UnderscoreCqlToCamelCaseMappings(),
    },
  },
};

const mapper = new Mapper(client('user'), mappingOptions);

const User = mapper.forModel('User');

export default User;
