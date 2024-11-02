const validateEmail = require('../../email');
const validateUsername = require('../../username');

const validateUsernameOrEmail = async (usernameOrEmail) => {
    if(usernameOrEmail && usernameOrEmail.includes('@')) return await validateEmail(usernameOrEmail);
    return await validateUsername(usernameOrEmail);
};

module.exports = validateUsernameOrEmail;