const getDateInString = require("../utils/get-date-in-string");

class TeamMember {
    constructor(row) {
        this.id = row.id;
        this.fullName = row.full_name;
        this.jobPosition = row.job_position;
        this.shortDescription = row.short_description;
        this.facebookLink = row.facebook_link;
        this.twitterLink = row.twitter_link;
        this.youtubeLink = row.youtube_link;
        this.pinterestLink = row.pinterest_link;
        this.instagramLink = row.instagram_link;
        this.imagePath = row.image_path;
        this.createdAt = getDateInString(row.created_at);
        this.updatedAt = row.updated_at ? getDateInString(row.updated_at) : null;
    };

    static parseOne(row, safe = true) {
        let teamMember = new TeamMember(row);
        if(safe){
            delete teamMember.createdAt;
            delete teamMember.updatedAt;
        }

        return teamMember;
    };

    static parseMany(row, safe = true) {
        return row.map(row => TeamMember.parseOne(row, safe));
    };
};

module.exports = TeamMember;