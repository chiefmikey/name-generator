import cassandra from 'cassandra-driver';

const { PlainTextAuthProvider } = cassandra.auth;

const auth = PlainTextAuthProvider('cassandra', 'cassandra');

const client = new cassandra.Client({
  contactPoints: ['0.0.0.0'],
  localDataCenter: 'datacenter1',
  keyspace: 'user',
  authProvider: auth,
});

export default client;

// const query = 'SELECT name, email FROM users WHERE key = ?';

// client
//   .execute(query, ['someone'])
//   .then((result) => console.log('User with email %s', result.rows[0].email));
