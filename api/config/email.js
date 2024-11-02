require('dotenv').config();

const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_HOST = process.env.MONGO_HOST;

const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL = process.env.EMAIL;

module.exports = {
    MONGO_PORT,
    MONGO_DB_NAME,
    MONGO_HOST,

    EMAIL,
    EMAIL_PASSWORD,
    EMAIL_PORT,
    EMAIL_HOST
};