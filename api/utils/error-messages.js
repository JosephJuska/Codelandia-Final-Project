const alreadyExists = (valueName) => {
    return `${valueName} already exists`;
};

const mustBeProvided = (valueName) => {
    return `${valueName} must be provided`;
}

const EMAIL_OR_PASSWORD_IS_INCORRECT = 'Email or Password is incorrect';

const PASSWORD_IS_INCORRECT = 'Password is incorrect';

const USERNAME_EMAIL_OR_PASSWORD_IS_INCORRECT = 'Username, email or password is incorrect';

const TOKEN_EXPIRED = 'Token has expired';
const TOKEN_INVALID = 'Token is invalid';

const AUTHORIZATION_HEADER_BAD = 'Authorization header not found or invalid';

const SESSION_NOT_FOUND = 'Session not found';

const USER_NOT_FOUND = 'User not found';
const VERIFICATION_NOT_FOUND = 'No such verification exists';

const TOO_MANY_VERIFICATION_ATTEMPTS = 'You have made too many verification attempts for today. Try again tomorrow';

const BLOG_NOT_FOUND = 'Blog not found';
const BLOG_NOT_OWNER = 'Blog is not owned by this user';

const PAGE_OR_ID_NOT_PROVIDED = 'page or id must be provided';

const CATEGORY_NOT_FOUND = 'Category not found';
const PRODUCT_TYPE_NOT_FOUND = 'Product type not found';
const PRODUCT_TYPE_FIELD_NOT_FOUND = 'Product type field not found';

const ANNOUNCEMENT_NOT_FOUND = 'Announcement not found';
const TEAM_MEMBER_NOT_FOUND = 'Team member not found';
const DISCOUNT_NOT_FOUND = 'Discount not found';
const COMMENT_NOT_FOUND = 'Comment not found';
const BANNER_NOT_FOUND = 'Banner not found';
const BRAND_NOT_FOUND = 'Brand not found';
const PRODUCT_NOT_FOUND = 'Product not found';
const PRODUCT_ITEM_NOT_FOUND = 'Product item not found';
const PRODUCT_VARIATION_NOT_FOUND = 'Product variation not found';
const PRODUCT_VARIATION_FIELD_NOT_FOUND = 'Product variation field not found';
const REVIEW_NOT_FOUND = 'Review not found';

module.exports = {
    alreadyExists,
    mustBeProvided,

    PASSWORD_IS_INCORRECT,

    EMAIL_OR_PASSWORD_IS_INCORRECT,
    USERNAME_EMAIL_OR_PASSWORD_IS_INCORRECT,

    TOKEN_EXPIRED,
    TOKEN_INVALID,

    AUTHORIZATION_HEADER_BAD,

    SESSION_NOT_FOUND,

    USER_NOT_FOUND,

    VERIFICATION_NOT_FOUND,
    TOO_MANY_VERIFICATION_ATTEMPTS,

    BLOG_NOT_FOUND,
    BLOG_NOT_OWNER,

    PAGE_OR_ID_NOT_PROVIDED,

    CATEGORY_NOT_FOUND,
    PRODUCT_TYPE_NOT_FOUND,
    PRODUCT_TYPE_FIELD_NOT_FOUND,

    ANNOUNCEMENT_NOT_FOUND,
    TEAM_MEMBER_NOT_FOUND,
    DISCOUNT_NOT_FOUND,
    COMMENT_NOT_FOUND,
    BANNER_NOT_FOUND,
    BRAND_NOT_FOUND,
    PRODUCT_NOT_FOUND,
    PRODUCT_ITEM_NOT_FOUND,
    PRODUCT_VARIATION_NOT_FOUND,
    PRODUCT_VARIATION_FIELD_NOT_FOUND,
    REVIEW_NOT_FOUND
};
