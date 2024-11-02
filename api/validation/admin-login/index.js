const validatePassword = require('../user-password');
const validateUsernameOrEmail = require('./username-or-email');

const validateAdminLogin = (usernameOrEmail, password) => {
    return {
        usernameOrEmail: [usernameOrEmail, validateUsernameOrEmail],
        password: [password, validatePassword]
    }
};

module.exports = validateAdminLogin