const generateUniqueToken = require("../utils/generate-unique-token");
const { generate400BadRequest, generateDatabaseErrorResponse, generate201Created, generate204NoContent, generate404NotFound } = require("../utils/response-generator");
const validateEmail = require("../validation/email");

const newsletterService = require('../service/newsletterService');
const validateToken = require("../validation/token");

const subscribeToNewsLetter = async (req, res) => {
    const emailP = req.body?.email;
    const validateEmailResult = await validateEmail(emailP);
    if(!validateEmailResult.success) return generate400BadRequest(res, validateEmailResult.error);

    const email = validateEmailResult.data;

    const token = generateUniqueToken(email);

    const createSubscriberResult = await newsletterService.createSubscriber(email, token);
    if(!createSubscriberResult.success) return generateDatabaseErrorResponse(res, createSubscriberResult);

    return generate201Created(res);
};

const unsubscribeFromNewsLetter = async (req, res) => {
    const tokenP = req.params?.token;
    const validateTokenResult = await validateToken(tokenP);
    if(!validateTokenResult.success) return generate404NotFound(res);

    const token = validateTokenResult.data;

    const unsubscribeResult = await newsletterService.unsubscribe(token);
    if(!unsubscribeResult.success) return generateDatabaseErrorResponse(res, unsubscribeResult);
    
    return generate204NoContent(res);
};

module.exports = {
    subscribeToNewsLetter,
    unsubscribeFromNewsLetter
};