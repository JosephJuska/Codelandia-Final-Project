require('dotenv').config();

const API_PORT = process.env.API_PORT;
const LIMIT = parseInt(process.env.LIMIT);

module.exports = {
    API_PORT,
    LIMIT
};