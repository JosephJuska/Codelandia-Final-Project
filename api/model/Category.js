const getDateInString = require("../utils/get-date-in-string");

class Category {
    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.slug = row.slug;
        this.parentID = row.parent_id;
        this.parentName = row.parent_name;
        this.productTypeID = row.product_type_id;
        this.productTypeName = row.product_type_name;
        this.imagePath = row.image_path;
        this.level = row?.level;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let category = new Category(row);
        if(safe){
            delete category.createdAt;
            delete category.updatedAt;
        }

        return category;
    }

    static parseMany(rows, safe = true) {
        return rows.map(row => Category.parseOne(row, safe));
    }
}

module.exports = Category;