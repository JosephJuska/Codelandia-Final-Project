require('dotenv').config();

const HASH_SALT = process.env.HASH_SALT;

module.exports = {
    HASH_SALT
}