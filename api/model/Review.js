const getDateInString = require("../utils/get-date-in-string");

class Review {
    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.description = row.description;
        this.review = row.review;
        this.productName = row.product_name;
        this.productID = row.product_id;
        this.name = row.name;
        this.email = row.email;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    };

    static parseOne(row, safe = true) {
        let review = new Review(row);
        if(safe){
            delete review.email;
            delete review.createdAt;
            delete review.updatedAt;
        }
        return review;
    };

    static parseMany(rows, safe = true) {
        return rows.map(row => Review.parseOne(row, safe));
    };
};

module.exports = Review;