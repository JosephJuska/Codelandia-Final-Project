const getDateInString = require("./get-date-in-string");

class LoggingData{
    constructor(message, data, error){
        this.level = error ? 'ERROR' : 'INFO';
        this.message = message;
        this.data = data;
        this.error = error;
        this.date = getDateInString(new Date(), 'YYYY-MM-DD HH:mm:ss');
    }
}

module.exports = LoggingData;