const getDateInString = require("../utils/get-date-in-string");

class User {
    constructor(row) {
        this.id = row.id;
        this.username = row.username;
        this.firstName = row.first_name;
        this.lastName = row.last_name;
        this.email = row.email;
        this.roleID = row.role_id;
        this.verified = row.verified;
        this.isActive = row.is_active;
        this.password = row.password;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    }

    static parseOne(row, safe = true){
        const user = new User(row);
        if(safe) {
            delete user.username;
            delete user.roleID;
            delete user.password;
            delete user.createdAt;
            delete user.updatedAt;
        };

        return user;
    }

    static parseMany(rows, safe = true){
        return rows.map((row) => User.parseOne(row, safe));
    }
};

module.exports = User;