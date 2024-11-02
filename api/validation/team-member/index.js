const validateLink = require("../link");
const validateTeamMemberFullName = require("./team-member-full-name");
const validateTeamMemberImage = require("./team-member-image");
const validateTeamMemberJobPosition = require("./team-member-job-position");
const validateTeamMemberShortDescription = require("./team-member-short-description");

const validateTeamMember = (fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink, imageBuffer) => {
    return {
        fullName: [fullName, validateTeamMemberFullName],
        jobPosition: [jobPosition, validateTeamMemberJobPosition],
        shortDescription: [shortDescription, validateTeamMemberShortDescription],
        youtubeLink: [youtubeLink, async () => {return await validateLink(youtubeLink, false)}],
        facebookLink: [facebookLink, async () => {return await validateLink(facebookLink, false)}],
        twitterLink: [twitterLink, async () => {return await validateLink(twitterLink, false)}],
        pinterestLink: [pinterestLink, async () => {return await validateLink(pinterestLink, false)}],
        instagramLink: [instagramLink, async () => {return await validateLink(instagramLink, false)}],
        image: [imageBuffer, validateTeamMemberImage]
    }
};

const validateTeamMemberUpdate = (fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink, imageBuffer) => {
    return {
        fullName: [fullName, validateTeamMemberFullName],
        jobPosition: [jobPosition, validateTeamMemberJobPosition],
        shortDescription: [shortDescription, validateTeamMemberShortDescription],
        youtubeLink: [youtubeLink, async () => {return await validateLink(youtubeLink, false)}],
        facebookLink: [facebookLink, async () => {return await validateLink(facebookLink, false)}],
        twitterLink: [twitterLink, async () => {return await validateLink(twitterLink, false)}],
        pinterestLink: [pinterestLink, async () => {return await validateLink(pinterestLink, false)}],
        instagramLink: [instagramLink, async () => {return await validateLink(instagramLink, false)}],
        image: [imageBuffer, async () => {return await validateTeamMemberImage(imageBuffer, false)}]
    }
};

module.exports = {
    validateTeamMember,
    validateTeamMemberUpdate
};