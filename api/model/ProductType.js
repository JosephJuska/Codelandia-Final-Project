const getDateInString = require("../utils/get-date-in-string");

class ProductTypeField {
    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.fieldTypeID = row.field_type_id;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let productTypeField = new ProductTypeField(row);
        if(safe){
            delete productTypeField.createdAt;
            delete productTypeField.updatedAt;
        }
        return productTypeField;
    }

    static parseMany(rows, safe = true) {
        return rows.map(row => ProductTypeField.parseOne(row, safe));
    }
}

class ProductType {
    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.fields = row.fields;
        this.productCount = row.product_count;
        this.categoryCount = row.category_count;
        this.createdAt = new Date(row.created_at);
        this.updatedAt = row.updated_at ? new Date(row.updated_at) : null;
        this.deleted = row.deleted;
        this.deletedAt = row.deleted_at ? new Date(row.deleted_at) : null;
    }

    static parseOne(row, safe = true) {
        let productType = new ProductType(row);
        productType.fields = ProductTypeField.parseMany(row.fields, safe);
        if(safe){
            delete productType.createdAt;
            delete productType.updatedAt;
            delete productType.deleted;
            delete productType.deletedAt;
        }
        return productType;
    }

    static parseMany(rows, safe = true) {
        return rows.map(row => ProductType.parseOne(row, safe));
    }
};

module.exports = {
    ProductType,
    ProductTypeField
};