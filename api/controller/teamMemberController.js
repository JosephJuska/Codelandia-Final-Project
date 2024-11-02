const generateTeamMemberImagePath = require("../utils/generate-team-member-image-path");
const { generate400BadRequest, generate500ServerError, generateDatabaseErrorResponse, generate201Created, generate202Accepted, generate204NoContent, generate200OK, generate404NotFound } = require("../utils/response-generator");
const uploadImage = require("../utils/upload-image");
const massValidator = require("../validation/mass-validator");
const { validateTeamMember, validateTeamMemberUpdate } = require("../validation/team-member");

const teamMemberService = require('../service/teamMemberService');
const validateID = require("../validation/id");

const errorMessages = require('../utils/error-messages');

const createTeamMember = async (req, res) => {
    const fullNameP = req.body?.fullName;
    const jobPositionP = req.body?.jobPosition;
    const shortDescriptionP = req.body?.shortDescription;
    const youtubeLinkP = req.body?.youtubeLink;
    const facebookLinkP = req.body?.facebookLink;
    const twitterLinkP = req.body?.twitterLink;
    const pinterestLinkP = req.body?.pinterestLink;
    const instagramLinkP = req.body?.instagramLink;
    const imageP = req?.file;

    const teamMemberObject = validateTeamMember(fullNameP, jobPositionP, shortDescriptionP, facebookLinkP, twitterLinkP, youtubeLinkP, pinterestLinkP, instagramLinkP, imageP?.buffer);
    const validationResult = await massValidator(teamMemberObject);
    
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink } = validationResult.data;

    const uploadImageResult = await uploadImage(imageP, generateTeamMemberImagePath, 'team-member/');
    if(!uploadImageResult.success) return generate500ServerError(res);

    const imagePath = uploadImageResult.data;

    const createMemberResult = await teamMemberService.createTeamMember(fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink, imagePath);
    if(!createMemberResult.success) return generateDatabaseErrorResponse(res, createMemberResult);

    return generate201Created(res, createMemberResult.data);
};

const updateTeamMember = async (req, res) => {
    const idP = req.params?.id;

    const IDValidationResult = await validateID(idP);
    if(!IDValidationResult.success) return generate404NotFound(res, errorMessages.TEAM_MEMBER_NOT_FOUND);

    const id = IDValidationResult.data;

    const fullNameP = req.body?.fullName;
    const jobPositionP = req.body?.jobPosition;
    const shortDescriptionP = req.body?.shortDescription;
    const youtubeLinkP = req.body?.youtubeLink;
    const facebookLinkP = req.body?.facebookLink;
    const twitterLinkP = req.body?.twitterLink;
    const pinterestLinkP = req.body?.pinterestLink;
    const instagramLinkP = req.body?.instagramLink;
    const imageP = req?.file;

    const teamMemberObject = validateTeamMemberUpdate(fullNameP, jobPositionP, shortDescriptionP, facebookLinkP, twitterLinkP, youtubeLinkP, pinterestLinkP, instagramLinkP, imageP?.buffer);
    const validationResult = await massValidator(teamMemberObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink } = validationResult.data;

    let imagePath = null;
    if(imageP) {
        const uploadImageResult = await uploadImage(imageP, generateTeamMemberImagePath, 'team-member/');
        if(!uploadImageResult.success) return generate500ServerError(res);

        imagePath = uploadImageResult.data;
    };

    const updateMemberResult = await teamMemberService.updateTeamMember(id, fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink, imagePath);
    if(!updateMemberResult.success) return generateDatabaseErrorResponse(res, updateMemberResult);

    return generate202Accepted(res);
};

const deleteTeamMember = async (req, res) => {
    const idP = req.params?.id;

    const IDValidationResult = await validateID(idP);
    if(!IDValidationResult.success) return generate404NotFound(res, errorMessages.TEAM_MEMBER_NOT_FOUND);

    const id = IDValidationResult.data;

    const deleteMemberResult = await teamMemberService.deleteTeamMember(id);
    if(!deleteMemberResult.success) return generateDatabaseErrorResponse(res, deleteMemberResult);

    return generate204NoContent(res);
};

const getTeamMembersProtected = async (req, res) => {
    const teamMembersResult = await teamMemberService.getTeamMembers(false);
    if(!teamMembersResult.success) return generateDatabaseErrorResponse(res, teamMembersResult);

    return generate200OK(res, teamMembersResult.data);
};

const getTeamMembersPublic = async (req, res) => {
    const teamMembersResult = await teamMemberService.getTeamMembers();
    if(!teamMembersResult.success) return generateDatabaseErrorResponse(res, teamMembersResult);

    return generate200OK(res, teamMembersResult.data);
};

const getTeamMemberByID = async (req, res) => {
    const idP = req.params?.id;

    const IDValidationResult = await validateID(idP);
    if(!IDValidationResult.success) return generate404NotFound(res, errorMessages.TEAM_MEMBER_NOT_FOUND);

    const id = IDValidationResult.data;

    const getTeamMemberResult = await teamMemberService.getTeamMemberByID(id, false);
    if(!getTeamMemberResult.success) return generateDatabaseErrorResponse(res, getTeamMemberResult);

    return generate200OK(res, getTeamMemberResult.data);
};

module.exports = {
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMembersPublic,
    getTeamMembersProtected,
    getTeamMemberByID
};