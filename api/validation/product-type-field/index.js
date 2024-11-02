const validateFieldTypeID = require("../field-type-id");
const validateProductTypeFieldName = require("./product-type-field-name");

const validateProductTypeField = (fieldTypeID, name) => {
    return {
        fieldTypeID: [fieldTypeID, validateFieldTypeID],
        name: [name, validateProductTypeFieldName]
    }
};

module.exports = validateProductTypeField