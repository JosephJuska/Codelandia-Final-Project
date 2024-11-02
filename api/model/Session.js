const getDateInString = require("../utils/get-date-in-string");

class Session {
    constructor(row) {
        this.id = row.id;
        this.userID = row.user_id;
        this.sessionToken = row.session_token;
        this.expired = row.expired;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    }

    static parseOne(row) {
        return new Session(row);
    }

    static parseMany(rows) {
        return rows.map(row => new Session(row));
    }
};

module.exports = Session;