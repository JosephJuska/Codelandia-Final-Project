const validateAnnouncementDate = require("../announcement/announcement-date");
const validateAnnouncementTitle = require("../announcement/announcement-title");
const validateBoolean = require("../boolean");
const validatePage = require("../page");
const validateAnnouncementSort = require("./announcement-sort-by");

const validateAnnouncementGet = (isActive, searchTerm, sortBy, startDate, endDate, page) => {
    return {
        isActive: [isActive, async () => {return await validateBoolean(isActive, 'isActive', false)}],
        searchTerm: [searchTerm, async () => {return await validateAnnouncementTitle(searchTerm, false)}],
        sortBy: [sortBy, validateAnnouncementSort],
        startDate: [startDate, async () => {return await validateAnnouncementDate(startDate, 'startDate', false)}],
        endDate: [endDate, async () => {return await validateAnnouncementDate(endDate, 'endDate', false)}],
        page: [page, validatePage]
    };
};

module.exports = validateAnnouncementGet;