const validateEmail = require("../email");
const validatePassword = require('../user-password/');

const validateLogin = (email, password) => {
    return {
        email: [email, validateEmail],
        password: [password, validatePassword]
    }
};

module.exports = validateLogin;