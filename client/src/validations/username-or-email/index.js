import validateEmail from "../email";
import validateUsername from "../username";

const validateUsernameOrEmail = async (usernameOrEmail) => {
    if(usernameOrEmail && usernameOrEmail.includes('@')) return await validateEmail(usernameOrEmail);
    return await validateUsername(usernameOrEmail);
};

export default validateUsernameOrEmail;