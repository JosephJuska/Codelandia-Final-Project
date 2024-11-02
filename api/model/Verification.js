const getDateInString = require("../utils/get-date-in-string");

class Verification {
    constructor(row) {
        this.id = row.id;
        this.userId = row.user_id;
        this.isAccount = row.account;
        this.isPassword = row.password;
        this.isEmail = row.email;
        this.newEmail = row.new_email;
        this.verificationToken = row.verification_token;
        this.expiresAt = row.expires_at;
        this.confirmed = row.confirmed;
        this.createdAt = getDateInString(row.created_at);
    }

    static parseOne(row) {
        return new Verification(row);
    }

    static parseMany(rows) {
        return rows.map(Verification.parseOne);
    }
};

module.exports = Verification;