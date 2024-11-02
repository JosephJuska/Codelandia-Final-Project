const getDateInString = require("../utils/get-date-in-string");

class Brand {
    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.code = row.code;
        this.imagePath = row.image_path;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let brand = new Brand(row);

        if (safe) {
            delete brand.createdAt;
            delete brand.updatedAt;
        }

        return brand;
    }

    static parseMany(rows, safe = true) {
        return rows.map(row => Brand.parseOne(row, safe));
    }
};

module.exports = Brand;