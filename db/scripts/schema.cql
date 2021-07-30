CREATE KEYSPACE IF NOT EXISTS user WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 };

CREATE TABLE user.name (
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
