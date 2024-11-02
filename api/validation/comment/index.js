const validateCommentContent = require("./comment-content");
const validateEmail = require("../email");
const validateID = require("../id");
const validateName = require("../user-name");

const validateComment = (name, email, content, id) => {
    return {
        name: [name, async () => {return await validateName(name, 'name')}],
        email: [email, validateEmail],
        content: [content, validateCommentContent],
        id: [id, validateID]
    };
};

module.exports = validateComment