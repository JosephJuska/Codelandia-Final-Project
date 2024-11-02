const currencyService = require('../service/currencyService');
const { generate500ServerError, generate200OK, generate400BadRequest, generate202Accepted } = require('../utils/response-generator');
const CURRENCY_API_KEY = require('../config/currency');
const validateCurrency = require('../validation/currency');
const massValidator = require('../validation/mass-validator');

const getCurrency = async (req, res) => {
    const result = await currencyService.getCurrency();
    if(!result.success) return generate500ServerError(res);

    return generate200OK(res, result.data);
};

const getCurrentCurrency = async (req, res) => {
    const url = `https://openexchangerates.org/api/latest.json?app_id=${CURRENCY_API_KEY}&symbols=AZN,EUR,TRY`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();

        const roundedRates = {};
        for (const [currency, rate] of Object.entries(data.rates)) {
            roundedRates[currency] = parseFloat(rate.toFixed(5));
        }

        return generate200OK(res, roundedRates);
    } catch (error) {
        return generate500ServerError(res);
    }
};

const updateCurrency = async (req, res) => {
    const aznP = req.body.azn;
    const eurP = req.body.eur;
    const tryP = req.body.try;

    const validationObject = validateCurrency(aznP, eurP, tryP);
    const validationResult = await massValidator(validationObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { azn, eur, tr } = validationResult.data;
    const result = await currencyService.updateCurrency(azn, eur, tr);
    if(!result.success) return generate500ServerError(res);

    return generate202Accepted(res);
};

module.exports = {
    getCurrency,
    getCurrentCurrency,
    updateCurrency
};