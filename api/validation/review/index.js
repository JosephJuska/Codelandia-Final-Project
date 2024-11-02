const validateEmail = require("../email");
const validateID = require("../id");
const validateName = require("../user-name");
const validateReviewDescription = require("./review-description");
const validateReviewReview = require("./review-review");
const validateReviewTitle = require("./review-title");

const validateReview = (title, description, review, productID, name, email) => {
    return {
        title: [title, validateReviewTitle],
        description: [description, validateReviewDescription],
        review: [review, validateReviewReview],
        productID: [productID, validateID],
        name: [name, async () => {return await validateName(name, 'name')}],
        email: [email, validateEmail]
    };
};

module.exports = validateReview;