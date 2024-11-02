const getDateInString = require("../utils/get-date-in-string");

class Comment {
    constructor(row) {
        this.id = row.id;
        this.blogID = row.blog_id;
        this.blogTitle = row.blog_title;
        this.name = row.name;
        this.email = row.email;
        this.content = row.content;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let comment = new Comment(row);
        if(safe){
            delete comment.updatedAt;
            delete comment.blogID;
            delete comment.blogTitle;
            delete comment.email;
        }

        return comment;
    };

    static parseMany(rows, safe = true) {
        return rows.map(row => Comment.parseOne(row, safe));
    };
};

module.exports = Comment;