const getDateInString = require("../utils/get-date-in-string");

class Announcement {
    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.startDate = getDateInString(row.start_date);
        this.endDate = getDateInString(row.end_date);
        this.isActive = row.is_active;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    };

    static parseOne(row, safe = true) {
        let announcement = new Announcement(row);
        if(safe){
            delete announcement.createdAt;
            delete announcement.updatedAt;
        }
        return announcement;
    };

    static parseMany(rows, safe = true) {
        return rows.map(row => Announcement.parseOne(row, safe));
    };
};

module.exports = Announcement;