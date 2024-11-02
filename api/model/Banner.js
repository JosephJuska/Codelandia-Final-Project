const getDateInString = require("../utils/get-date-in-string");

class Banner {
    constructor(row) {
        this.id = row.id;
        this.header = row.header;
        this.subHeader = row.sub_header;
        this.backgroundPath = row.background_path;
        this.buttonText = row.button_text;
        this.buttonLink = row.button_link;
        this.isActive = row.is_active;
        this.activeTill = row.active_till ? getDateInString(row.active_till) : null;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let banner = new Banner(row);
        if (safe) {
            delete banner.createdAt;
            delete banner.updatedAt;
        }

        return banner;
    }

    static parseMany(rows, safe = true) {
        return rows.map(row => Banner.parseOne(row, safe));
    }
}

module.exports = Banner;