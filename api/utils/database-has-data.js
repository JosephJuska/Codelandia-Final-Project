const databaseResultHasData = (result) => {
    return result.data?.rows && result.data.rows.length > 0
};

module.exports = databaseResultHasData;