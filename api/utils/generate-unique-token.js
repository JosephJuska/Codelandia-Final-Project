const crypto = require('crypto');

const generateUniqueToken = (data) => {
    const currentTime = new Date().getTime().toString();
    const string = data.toString() + currentTime;

    const token = crypto.createHash('sha256').update(string).digest('hex');

    return token;
};

module.exports = generateUniqueToken;