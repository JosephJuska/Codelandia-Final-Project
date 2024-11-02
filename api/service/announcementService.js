const orm = require("../database/orm");
const queries = require("../database/queries");
const Announcement = require("../model/Announcement");
const databaseResultHasData = require("../utils/database-has-data");

const createAnnouncement = async (title, startDate, endDate, isActive) => {
    const result = await orm.makeRequest(queries.ANNOUNCEMENT.CREATE_ANNOUNCEMENT, [title, startDate, endDate, isActive]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const updateAnnouncement = async (id, title, startDate, endDate, isActive) => {
    const result = await orm.makeRequest(queries.ANNOUNCEMENT.UPDATE_ANNOUNCEMENT, [id, title, startDate, endDate, isActive]);
    return result;
};

const deleteAnnouncement = async (id) => {
    const result = await orm.makeRequest(queries.ANNOUNCEMENT.DELETE_ANNOUNCEMENT, [id]);
    return result;
};

const getAnnouncementByID = async (id) => {
    const result = await orm.makeRequest(queries.ANNOUNCEMENT.GET_ANNOUNCEMENT_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = Announcement.parseOne(result.data.rows[0], false);
    else result.data = null;

    return result;
};  

const getActiveAnnouncements = async (safe = true) => {
    const result = await orm.makeRequest(queries.ANNOUNCEMENT.GET_ACTIVE_ANNOUNCEMENTS, []);
    if(databaseResultHasData(result)) result.data = Announcement.parseMany(result.data.rows, safe);
    else result.data = null;

    return result;
};

const getAnnouncements = async (isActive, searchTerm, sortBy, start_date, end_date, limit, offset) => {
    const result = await orm.makeRequest(queries.ANNOUNCEMENT.GET_ANNOUNCEMENTS, [isActive, searchTerm, sortBy, start_date, end_date, limit, offset]);
    if(databaseResultHasData(result)){
        result.data = { pageCount: result.data.rows[0].page_count, announcements: Announcement.parseMany(result.data.rows, false)};
    } else result.data = null;

    return result;
};

module.exports = {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getAnnouncementByID,
    getActiveAnnouncements,
    getAnnouncements,
}