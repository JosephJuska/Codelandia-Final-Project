const getDateInString = require("../utils/get-date-in-string");

class Writer {
    constructor(row) {
        this.id = row.id;
        this.firstName = row.first_name;
        this.lastName = row.last_name;
        this.username = row.username;
        this.email = row.email;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
        this.totalBlogs = row.total_blogs;
        this.publishedBlogs = row.published_blogs;
        this.unPublishedBlogs = row.unpublished_blogs;
        this.totalComments = row.total_comments;
    };

    static parseOne(row) {
        return new Writer(row);
    };

    static parseMany(rows) {
        return rows.map(row => new Writer(row));
    };
};

module.exports = Writer;