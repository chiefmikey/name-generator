import cassandra from 'cassandra-driver';

const client = (ks) =>
  new cassandra.Client({
    contactPoints: ['name-generator_db'],
    localDataCenter: 'datacenter1',
    credentials: { username: 'cassandra', password: 'cassandra' },
    keyspace: ks,
  });

const init = `CREATE KEYSPACE IF NOT EXISTS user WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };`;

const use = `USE user`;

const construct = `
  CREATE TABLE IF NOT EXISTS user.name (
    emotion text,
    normal_emotion text,
    emo_emotion text,
    animal text,
    pet_name text,
    birthday text,
    fruit text,
    sugar text,
    main_result text,
    emo_result text,
    PRIMARY KEY (birthday, fruit, animal)
  );
`;

client('system')
  .execute(init)
  .catch((error) => console.error('client init error', error));

setTimeout(() => {
  client('system')
    .execute(use)
    .catch((error) => console.error('client use error', error));
  client('user')
    .execute(construct)
    .catch((error) => console.error('client construct error', error));
}, 20_000);

export default client;
