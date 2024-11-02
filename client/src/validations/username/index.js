import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../default-validators";
import { ValidationError, ValidationSuccess } from "../validation-result";

import validator from "../validator";

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

const validateUsername = async (username) => {
    return await validator(username, [], [validateUsernameIsString, validateUsernameIsCorrectLength, validateUsernameIsValidFormat], validateUsernameIsProvided, false);
};

export default validateUsername;