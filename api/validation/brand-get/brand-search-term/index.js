const validateBrandCode = require("../../brand/brand-code");
const validateBrandName = require("../../brand/brand-name");

const validateBrandSearchTerm = async (searchTerm) => {
    let result;
    if(searchTerm && !isNaN(parseInt(searchTerm))) result = await validateBrandCode(searchTerm, false);
    else result =  await validateBrandName(searchTerm, false);

    return result;
};

module.exports = validateBrandSearchTerm