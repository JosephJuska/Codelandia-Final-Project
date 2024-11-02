const userQueries = require('./user');
const verificationQueries = require('./verification');
const sessionQueries = require('./session');
const blogQueries = require('./blog');
const commentQueries = require('./comment');
const categoryQueries = require('./category');
const productTypeQueries = require('./product-type');
const brandQueries = require('./brand');
const newsletterQueries = require('./newsletter');
const teamMembersQueries = require('./team-member');
const bannerQueries = require('./banner');
const productQueries = require('./product');
const announcementQueries = require('./announcement');
const discountQueries = require('./discount');
const reviewQueries = require('./review');
const favoriteQueries = require('./favorite');
const currencyQueries = require('./currency');

module.exports = {
    USER: {
        ...userQueries
    },
    VERIFICATION: {
        ...verificationQueries
    },
    SESSION: {
        ...sessionQueries
    },
    BLOG: {
        ...blogQueries
    },
    COMMENT: {
        ...commentQueries
    },
    CATEGORY: {
        ...categoryQueries
    },
    PRODUCT_TYPE: {
        ...productTypeQueries
    },
    BRAND: {
        ...brandQueries
    },
    NEWSLETTER: {
        ...newsletterQueries
    },
    TEAM_MEMBERS: {
        ...teamMembersQueries
    },
    BANNER: {
        ...bannerQueries
    },
    PRODUCT: {
        ...productQueries
    },
    ANNOUNCEMENT: {
        ...announcementQueries
    },
    DISCOUNT: {
        ...discountQueries
    },
    REVIEW: {
        ...reviewQueries
    },
    FAVORITE: {
        ...favoriteQueries
    },
    CURRENCY: {
        ...currencyQueries
    }
};