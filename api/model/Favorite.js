const getDateInString = require("../utils/get-date-in-string");

class Favorite {
    constructor(row) {
        this.id = row.id;
        this.userID = row.userID;
        this.productID = row.productID;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    };

    static parseOne(row, safe = true) {
        let favorite = new Favorite(row);
        if(safe){
            delete favorite.createdAt;
            delete favorite.updatedAt;
        }
        return favorite;
    };

    static parseMany(rows, safe = true) {
        return rows.map(row => Favorite.parseOne(row, safe));
    };
};

module.exports = Favorite;