const validateCurrencyRate = require("./currency-rate");

const validateCurrency = (azn, eur, tr) => {
    return {
        azn: [azn, async () => {return await validateCurrencyRate(azn, 'azn')}],
        eur: [eur, async () => {return await validateCurrencyRate(eur, 'eur')}],
        tr: [tr, async () => {return await validateCurrencyRate(tr, 'try')}]
    }
};

module.exports = validateCurrency;