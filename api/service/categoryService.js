const orm = require("../database/orm");
const queries = require("../database/queries");
const Category = require("../model/Category");
const databaseResultHasData = require("../utils/database-has-data");

const getAllCategoriesHierarchy = async (safe = true) => {
    const result = await orm.makeRequest(queries.CATEGORY.GET_ALL_CATEGORIES_HIERARCHY, []);
    if(databaseResultHasData(result)) result.data = Category.parseMany(result.data.rows, safe);
    else result.data = null;

    return result;
};

const getAllCategories = async (has_product_type, safe = true) => {
    const result = await orm.makeRequest(queries.CATEGORY.GET_ALL_CATEGORIES, [has_product_type]);
    if(databaseResultHasData(result)) result.data = Category.parseMany(result.data.rows, safe);
    else result.data = null;

    return result;
};

const getCategoryBySlug = async (slug, safe = true) => {
    const result = await orm.makeRequest(queries.CATEGORY.GET_CATEGORY_BY_SLUG, [slug]);
    if(databaseResultHasData(result)) result.data = Category.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
};

const getCategoryByID = async (id, safe = true) => {
    const result = await orm.makeRequest(queries.CATEGORY.GET_CATEGORY_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = Category.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
};

const createCategory = async (name, slug, parentCategoryID, productTypeID, imagePath) => {
    const result = await orm.makeRequest(queries.CATEGORY.CREATE_CATEGORY, [name, slug, parentCategoryID, productTypeID, imagePath]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const updateCategory = async (id, name, slug, parentCategoryID, productTypeID, imagePath) => {
    const result = await orm.makeRequest(queries.CATEGORY.UPDATE_CATEGORY, [id, name, slug, parentCategoryID, productTypeID, imagePath]);
    return result;
};

const deleteCategory = async (id) => {
    const result = await orm.makeRequest(queries.CATEGORY.DELETE_CATEGORY, [id]);
    return result;
};

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategoriesHierarchy,
    getAllCategories,
    getCategoryBySlug,
    getCategoryByID
};