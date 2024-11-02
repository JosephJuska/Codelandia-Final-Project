const { generate400BadRequest, generateDatabaseErrorResponse, generate201Created, generate404NotFound, generate202Accepted, generate204NoContent, generate200OK } = require("../utils/response-generator");
const validateAnnouncement = require("../validation/announcement");
const validateAnnouncementGet = require('../validation/announcement-get');
const massValidator = require("../validation/mass-validator");

const announcementService = require('../service/announcementService');
const validateID = require("../validation/id");

const errorMessages = require('../utils/error-messages');

const { LIMIT } = require('../config/api');

const createAnnouncement = async (req, res) => {
    const titleP = req.body?.title;
    const startDateP = req.body?.startDate;
    const endDateP = req.body?.endDate;
    const isActiveP = req.body?.isActive;

    const announcementObject = validateAnnouncement(titleP, startDateP, endDateP, isActiveP);
    const validationResult = await massValidator(announcementObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { title, startDate, endDate, isActive } = validationResult.data;

    if(endDate < startDate) return generate400BadRequest(res, { endDate: 'endDate must be later than startDate' });

    const createResult = await announcementService.createAnnouncement(title, startDate, endDate, isActive);
    if(!createResult.success) return generateDatabaseErrorResponse(res, createResult);
    return generate201Created(res, createResult.data);
};

const updateAnnouncement = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.ANNOUNCEMENT_NOT_FOUND);

    const id = idValidationResult.data;

    const titleP = req.body?.title;
    const startDateP = req.body?.startDate;
    const endDateP = req.body?.endDate;
    const isActiveP = req.body?.isActive;

    const announcementObject = validateAnnouncement(titleP, startDateP, endDateP, isActiveP);
    const validationResult = await massValidator(announcementObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { title, startDate, endDate, isActive } = validationResult.data;

    if(endDate < startDate) return generate400BadRequest(res, { endDate: 'endDate must be later than startDate' });
    
    const updateResult = await announcementService.updateAnnouncement(id, title, startDate, endDate, isActive);
    if(!updateResult.success) return generateDatabaseErrorResponse(res, updateResult);

    return generate202Accepted(res);
};

const deleteAnnouncement = async (req, res) => {
    const idP = req.params?.id;

    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.ANNOUNCEMENT_NOT_FOUND);

    const id = idValidationResult.data;

    const deleteResult = await announcementService.deleteAnnouncement(id);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);

    return generate204NoContent(res);
};

const getAnnouncementByID = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.ANNOUNCEMENT_NOT_FOUND);

    const id = idValidationResult.data;

    const getResult = await announcementService.getAnnouncementByID(id);
    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

const getAnnouncementsPublic = async (req, res) => {
    const getResult = await announcementService.getActiveAnnouncements(true);
    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

const getAnnouncementsProtected = async (req, res) => {
    const isActiveP = req.query?.isActive;
    const searchTermP = req.query?.searchTerm;
    const sortByP = req.query?.sortBy || 'newest';
    const startDateP = req.query?.startDate;
    const endDateP = req.query?.endDate;
    const pageP = req.query?.page || 1;

    const announcementObject = validateAnnouncementGet(isActiveP, searchTermP, sortByP, startDateP, endDateP, pageP);
    const validationResult = await massValidator(announcementObject);

    if(!validationResult.success) return generate400BadRequest(res);

    const { isActive, searchTerm, sortBy, startDate, endDate, page } = validationResult.data;
    if(startDate && endDate && startDate > endDate) return generate400BadRequest({ endDate: 'endDate must be later than startDate' });

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getResult = await announcementService.getAnnouncements(isActive, searchTerm, sortBy, startDate, endDate, limit, offset);
    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

module.exports = {
    createAnnouncement, 
    updateAnnouncement,
    deleteAnnouncement,
    getAnnouncementByID,
    getAnnouncementsProtected,
    getAnnouncementsPublic
};