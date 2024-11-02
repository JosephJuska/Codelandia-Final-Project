const orm = require("../database/orm");
const queries = require("../database/queries");
const Review = require("../model/Review");
const databaseResultHasData = require("../utils/database-has-data");

const createReview = async (title, description, review, product_id, name, email) => {
    const result = await orm.makeRequest(queries.REVIEW.CREATE_REVIEW, [title, description, review, product_id, name, email]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const deleteReview = async (id) => {
    const result = await orm.makeRequest(queries.REVIEW.DELETE_REVIEW, [id]);
    return result;
};

const getReviewByID = async (id) => {
    const result = await orm.makeRequest(queries.REVIEW.GET_REVIEW_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = Review.parseOne(result.data.rows[0], false);
    else result.data = null;

    return result;
};

const getReviews = async (searchTerm, sortBy, productID, limit, offset) => {
    const result = await orm.makeRequest(queries.REVIEW.GET_REVIEWS, [searchTerm, sortBy, productID, limit, offset]);
    if(databaseResultHasData(result)) result.data = { pageCount: result.data.rows[0].page_count, reviews: Review.parseMany(result.data.rows, false) }
    else result.data = null;

    return result;
};

const getReviewsByProductID = async (id, isActive, limit, offset) => {
    const result = await orm.makeRequest(queries.REVIEW.GET_REVIEWS_BY_PRODUCT_ID, [id, isActive, limit, offset]);
    if(databaseResultHasData(result)) result.data = Review.parseMany(result.data.rows, false);
    else result.data = null;

    return result;
};

module.exports = {
    createReview,
    deleteReview,
    getReviewByID,
    getReviews,
    getReviewsByProductID,
};