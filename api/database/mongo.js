const { MongoClient } = require('mongodb');
const { MONGO_DB_NAME, MONGO_HOST, MONGO_PORT } = require('../config/email');

const mongoUri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;
let client;

const connectToDatabase = async () => {
  if (client && client.isConnected()) return client;

  client = new MongoClient(mongoUri);
  await client.connect();
  return client;
};

const getDatabase = async () => {
  const client = await connectToDatabase();
  return client.db(MONGO_DB_NAME);
};

module.exports = getDatabase;