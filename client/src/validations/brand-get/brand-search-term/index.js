import validateBrandCode from "../../brand/brand-code";
import validateBrandName from "../../brand/brand-name";

const validateSearchTerm = async (searchTerm) => {
    let result;
    if(searchTerm && !isNaN(parseInt(searchTerm))) result = await validateBrandCode(searchTerm, false);
    else result =  await validateBrandName(searchTerm, false);

    return result;
};

export default {
    validateSearchTerm
};