import cassandra from 'cassandra-driver';

const client = (ks) =>
  new cassandra.Client({
    contactPoints: ['ng_db'],
    localDataCenter: 'datacenter1',
    credentials: { username: 'cassandra', password: 'cassandra' },
    keyspace: ks,
  });

const init = `CREATE KEYSPACE IF NOT EXISTS user WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };`;

const use = `USE user`;

const construct = `
  CREATE TABLE IF NOT EXISTS user.name (
    emotion text,
    normalEmotion text,
    emoEmotion text,
    animal text,
    petName text,
    birthday text,
    fruit text,
    sugar text,
    mainResult text,
    emoResult text,
    PRIMARY KEY (birthday, fruit, animal)
  );
`;

client('system').execute(init);

setTimeout(() => {
  client('system').execute(use);
  client('user').execute(construct);
}, 20000);

export default client;
