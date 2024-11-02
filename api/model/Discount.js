const getDateInString = require("../utils/get-date-in-string");

class Discount {
    constructor(row) {
        this.id = row.id;
        this.productID = row.product_id;
        this.categoryID = row.category_id;
        this.brandID = row.brand_id;
        this.productTypeID = row.product_type_id;
        this.discountPercentage = row.discount_percentage;
        this.startDate = getDateInString(row.start_date);
        this.endDate = getDateInString(row.end_date);
        this.isActive = row.is_active;
        this.brandName = row.brand_name;
        this.categoryName = row.category_name;
        this.productTypeName = row.product_type_name;
        this.productName = row.product_name;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    };

    static parseOne(row, safe = true) {
        let discount = new Discount(row);
        if(safe){
            delete discount.productID;
            delete discount.categoryID;
            delete discount.brandID;
            delete discount.productTypeID;
            delete discount.brandName;
            delete discount.categoryName;
            delete discount.productTypeName;
            delete discount.productName;
            delete discount.createdAt;
            delete discount.updatedAt;
        }
        return discount;
    };
    
    static parseMany(rows, safe = true) {
        return rows.map(row => Discount.parseOne(row, safe));
    };
};

module.exports = Discount;