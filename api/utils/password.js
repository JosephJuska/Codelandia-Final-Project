const hashConfig = require('../config/hash');
const { ProcessSuccess, ProcessError } = require('./process-result');
const bcrypt = require('bcrypt');
const logData = require('../utils/log-data');
const LoggingData = require('../utils/log-data-object');

const hashPassword = (password) => {
    let logEntry;
    try {
        const hash = bcrypt.hashSync(password, hashConfig.HASH_SALT);
        logEntry = new LoggingData(
            'Password hashed successfully',
            null,
            null
        );
        logData(logEntry, 'hashing');
        return new ProcessSuccess(hash);
    } catch (e) {
        console.log('PASSWORD HASH ERROR: ' + e.message);
        logEntry = new LoggingData(
            e.message,
            null,
            e
        );
        logData(logEntry, 'hashing');
        return new ProcessError('', true);
    }
};

const comparePassword = (password, hashedPassword) => {
    try {
        const areSame = bcrypt.compareSync(password, hashedPassword);
        if (!areSame) {
            logData({ message: 'Passwords do not match', password }, 'hashing');
            return new ProcessError('Passwords do not match');
        }
        logData({ message: 'Passwords matched successfully', password }, 'hashing');
        return new ProcessSuccess();
    } catch (e) {
        console.log('PASSWORD COMPARE ERROR: ' + e.message);
        logData({ message: 'Password compare error', error: e.message, password }, 'hashing');
        return new ProcessError('', true);
    }
};

module.exports = {
    hashPassword,
    comparePassword
};