const bcrypt = require('bcrypt');
const HASH_CONFIG = require('../config/hash');

const password = process.argv[2];

if (!password) {
    console.error("Please provide a password to hash.");
    process.exit(1);
}

const hash = bcrypt.hashSync(password, HASH_CONFIG.HASH_SALT);
console.log(`Generated hash: ${hash}`);