const REGISTER = 'auth/register';
const LOGIN = 'auth/login';
const LOGOUT = 'auth/logout';
const TOKEN = 'auth/token';

const LOGIN_WRITER = 'auth/login/writer';
const LOGIN_ADMIN = 'auth/login/admin';


const GET_ACCOUNT_DETAILS_WRITER = 'user/account-writer';

const UPDATE_ACCOUNT = 'user/update-account';


const GET_BLOGS = 'blog';
const GET_BLOGS_WRITER = '/blog/writer';
const GET_BLOGS_LIST = 'blog/list';
const GET_BLOG_BY_ID = 'blog';
const ADD_BLOG_IMAGE = 'blog/add-image';
const CREATE_BLOG = 'blog';
const DELETE_BLOG = 'blog';
const UPDATE_BLOG = 'blog';


const GET_COMMENTS_BY_BLOG_ID = 'comment'
const DELETE_COMMENT = 'comment';
const CREATE_COMMENT = 'comment';


const GENERATE_RESET_PASSWORD = 'verify/generate/reset-password';
const CONFIRM_RESET_PASSWORD = 'verify/reset-password-confirm';
const RESET_PASSWORD = 'verify/reset-password';

const GENERATE_DELETE_ACCOUNT = 'verify/generate/delete';
const DELETE_ACCOUNT = 'verify/delete';

const GENERATE_EMAIL_UPDATE = 'verify/generate/email';
const UPDATE_EMAIL = 'verify/email';

const VERIFY_ACCOUNT = 'verify/account';


const GET_BRANDS = 'brand';
const DELETE_BRAND = 'brand';
const CREATE_BRAND = 'brand';
const GET_BRAND_BY_ID = 'brand';
const UPDATE_BRAND = 'brand';


const GET_TEAM_MEMBERS = 'team-member';
const DELETE_TEAM_MEMBER = 'team-member';
const CREATE_TEAM_MEMBER = 'team-member';
const GET_TEAM_MEMBER_BY_ID = 'team-member';
const UPDATE_TEAM_MEMBER = 'team-member';


const GET_BANNERS = 'banner';
const GET_BANNER_BY_ID = 'banner';
const CREATE_BANNER = 'banner';
const UPDATE_BANNER = 'banner';
const DELETE_BANNER = 'banner';


const GET_ANNOUNCEMENTS = 'announcement';
const GET_ANNOUNCEMENT_BY_ID = 'announcement';
const CREATE_ANNOUNCEMENT = 'announcement';
const UPDATE_ANNOUNCEMENT = 'announcement';
const DELETE_ANNOUNCEMENT = 'announcement';


const GET_PRODUCT_TYPES = 'product-type';
const GET_PRODUCT_TYPE_BY_ID = 'product-type';
const GET_PRODUCT_TYPE_BY_CATEGORY_ID = 'product-type/category';
const CREATE_PRODUCT_TYPE = 'product-type';
const UPDATE_PRODUCT_TYPE = 'product-type';
const DELETE_PRODUCT_TYPE = 'product-type';


const CREATE_PRODUCT_TYPE_FIELD = 'product-type/field';
const UPDATE_PRODUCT_TYPE_FIELD = 'product-type/field';
const DELETE_PRODUCT_TYPE_FIELD = 'product-type/field';


const GET_CATEGORIES = 'category';
const GET_CATEGORIES_LIST = 'category/list';
const GET_CATEGORY_BY_ID = 'category';
const CREATE_CATEGORY = 'category';
const UPDATE_CATEGORY = 'category';
const DELETE_CATEGORY = 'category';


const GET_USERS = 'user';
const GET_USER_BY_ID = 'user';
const GET_OWNERS = 'user/owners';
const CREATE_USER = 'user';
const UPDATE_USER = 'user';
const DELETE_USER = 'user';


const GET_DISCOUNTS = 'discount';
const GET_DISCOUNT_BY_ID = 'discount';
const CREATE_DISCOUNT = 'discount';
const UPDATE_DISCOUNT = 'discount';
const DELETE_DISCOUNT = 'discount';


const GET_PRODUCTS_LIST = 'product/list';
const GET_PRODUCTS = 'product';
const GET_PRODUCT_BY_ID = 'product';
const CREATE_PRODUCT = 'product';
const UPDATE_PRODUCT = 'product';
const DELETE_PRODUCT = 'product';


const ADD_IMAGE = 'product/add-image';
const CREATE_PRODUCT_ITEM = 'product/product-item';
const UPDATE_PRODUCT_ITEM = 'product/product-item';
const DELETE_PRODUCT_ITEM = 'product/product-item';


const CREATE_PRODUCT_VARIATION = 'product/product-variation';
const UPDATE_PRODUCT_VARIATION = 'product/product-variation';
const DELETE_PRODUCT_VARIATION = 'product/product-variation';


const CREATE_PRODUCT_VARIATION_FIELD = 'product/product-variation-field';
const UPDATE_PRODUCT_VARIATION_FIELD = 'product/product-variation-field';
const DELETE_PRODUCT_VARIATION_FIELD = 'product/product-variation-field';


const GET_REVIEWS = 'review';
const CREATE_REVIEW = 'review';
const DELETE_REVIEW = 'review';


const GET_CURRENCY = 'currency';
const GET_CURRENT_CURRENCY = 'currency/current';
const UPDATE_CURRENCY = 'currency';


export default {
    AUTH: {
        REGISTER,
        LOGIN,
        LOGOUT,
        TOKEN,
        LOGIN_WRITER,
        LOGIN_ADMIN
    },

    BLOG: {
        GET_BLOGS,
        GET_BLOGS_WRITER,
        GET_BLOG_BY_ID,
        GET_BLOGS_LIST,
        ADD_BLOG_IMAGE,
        CREATE_BLOG,
        DELETE_BLOG,
        UPDATE_BLOG
    },

    COMMENT: {
        GET_COMMENTS_BY_BLOG_ID,
        DELETE_COMMENT,
        CREATE_COMMENT
    },

    USER: {
        GET_ACCOUNT_DETAILS_WRITER,
        UPDATE_ACCOUNT,
        GET_USERS,
        GET_USER_BY_ID,
        GET_OWNERS,
        CREATE_USER,
        UPDATE_USER,
        DELETE_USER
    },

    VERIFY: {
        GENERATE_RESET_PASSWORD,
        CONFIRM_RESET_PASSWORD,
        RESET_PASSWORD,

        GENERATE_DELETE_ACCOUNT,
        DELETE_ACCOUNT,

        GENERATE_EMAIL_UPDATE,
        UPDATE_EMAIL,

        VERIFY_ACCOUNT
    },

    BRAND: {
        GET_BRANDS,
        GET_BRAND_BY_ID,
        DELETE_BRAND,
        CREATE_BRAND,
        UPDATE_BRAND
    },

    TEAM_MEMBER: {
        GET_TEAM_MEMBERS,
        GET_TEAM_MEMBER_BY_ID,
        DELETE_TEAM_MEMBER,
        UPDATE_TEAM_MEMBER,
        CREATE_TEAM_MEMBER
    },

    BANNER: {
        GET_BANNERS,
        GET_BANNER_BY_ID,
        CREATE_BANNER,
        UPDATE_BANNER,
        DELETE_BANNER
    },

    ANNOUNCEMENT: {
        GET_ANNOUNCEMENTS,
        GET_ANNOUNCEMENT_BY_ID,
        CREATE_ANNOUNCEMENT,
        UPDATE_ANNOUNCEMENT,
        DELETE_ANNOUNCEMENT
    },

    PRODUCT_TYPE: {
        GET_PRODUCT_TYPES,
        GET_PRODUCT_TYPE_BY_ID,
        GET_PRODUCT_TYPE_BY_CATEGORY_ID,
        CREATE_PRODUCT_TYPE,
        UPDATE_PRODUCT_TYPE,
        DELETE_PRODUCT_TYPE
    },

    PRODUCT_TYPE_FIELD: {
        CREATE_PRODUCT_TYPE_FIELD,
        UPDATE_PRODUCT_TYPE_FIELD,
        DELETE_PRODUCT_TYPE_FIELD
    },

    CATEGORY: {
        GET_CATEGORIES,
        GET_CATEGORY_BY_ID,
        GET_CATEGORIES_LIST,
        CREATE_CATEGORY,
        UPDATE_CATEGORY,
        DELETE_CATEGORY
    },

    DISCOUNT: {
        GET_DISCOUNTS,
        GET_DISCOUNT_BY_ID,
        CREATE_DISCOUNT,
        UPDATE_DISCOUNT,
        DELETE_DISCOUNT
    },

    PRODUCT: {
        GET_PRODUCTS_LIST,
        GET_PRODUCTS,
        GET_PRODUCT_BY_ID,
        CREATE_PRODUCT,
        UPDATE_PRODUCT,
        DELETE_PRODUCT
    },

    PRODUCT_ITEM: {
        ADD_IMAGE,
        CREATE_PRODUCT_ITEM,
        UPDATE_PRODUCT_ITEM,
        DELETE_PRODUCT_ITEM
    },

    PRODUCT_VARIATION: {
        CREATE_PRODUCT_VARIATION,
        UPDATE_PRODUCT_VARIATION,
        DELETE_PRODUCT_VARIATION
    },

    PRODUCT_VARIATION_FIELD: {
        CREATE_PRODUCT_VARIATION_FIELD,
        UPDATE_PRODUCT_VARIATION_FIELD,
        DELETE_PRODUCT_VARIATION_FIELD
    },

    REVIEW: {
        GET_REVIEWS,
        CREATE_REVIEW,
        DELETE_REVIEW
    },

    CURRENCY: {
        GET_CURRENCY,
        GET_CURRENT_CURRENCY,
        UPDATE_CURRENCY
    }
};