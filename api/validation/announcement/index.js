const validateBoolean = require("../boolean")
const validateAnnouncementDate = require("./announcement-date")
const validateAnnouncementTitle = require("./announcement-title")

const validateAnnouncement = (title, startDate, endDate, isActive) => {
    return {
        title: [title, validateAnnouncementTitle],
        startDate: [startDate, async () => {return await validateAnnouncementDate(startDate, 'startDate')}],
        endDate: [endDate, async () => {return await validateAnnouncementDate(endDate, 'endDate')}],
        isActive: [isActive, async () => {return await validateBoolean(isActive, 'isActive')}]
    }
};

module.exports = validateAnnouncement;