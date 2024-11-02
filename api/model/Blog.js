const getDateInString = require("../utils/get-date-in-string");

class Blog {
    constructor(row) {
        this.id = row.id;
        this.authorID = row.author_id;
        this.authorUsername = row.author_username;
        this.authorEmail = row.author_email;
        this.title = row.title;
        this.slug = row.slug;
        this.bannerPath = row.banner_path;
        this.description = row.description;
        this.subDescription = row.sub_description;
        this.rawContent = row.raw_content;
        this.content = row.content;
        this.commentCount = row.comment_count;
        this.published = row.published;
        this.publishDate = row.publish_date ? getDateInString(row.publish_date) : null;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    }

    static parseOne(row, safe = true) {
        let blog = new Blog(row);
        if(safe){
            delete blog.rawContent;
            delete blog.published;
            delete blog.createdAt;
            delete blog.updatedAt;
            delete blog.authorEmail;
        }
        
        return blog;
    }

    static parseMany(rows, safe = true) {
        return rows.map(row => Blog.parseOne(row, safe));
    }
};

module.exports = Blog;
