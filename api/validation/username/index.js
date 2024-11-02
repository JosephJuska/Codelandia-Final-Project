const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require('../default-validators');
const { ValidationError, ValidationSuccess } = require('../validation-result');

const validator = require('../validator');

const validateUsernameIsProvided = (username) => {
  return validateIsProvided(username, "username");
};

const validateUsernameIsString = (username) => {
  return validateIsCorrectType(username, "username", "string");
};

const validateUsernameIsCorrectLength = (username) => {
  return validateIsCorrectLength(username, "username", 2, 50);
};

const validateUsernameIsValidFormat = (username) => {
  const usernameRegex = /^[A-Za-z][A-Za-z0-9_.]*$/;
  if (!usernameRegex.test(username)) return new ValidationError("username must start with a letter and must contain only letters, numbers, underscores, lines and dots");
  return new ValidationSuccess();
};

const validateUsername = async (username, provided = true) => {
    return await validator(username, [], [validateUsernameIsString, validateUsernameIsCorrectLength, validateUsernameIsValidFormat], validateUsernameIsProvided, provided);
};

module.exports = validateUsername