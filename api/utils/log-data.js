const fs = require('fs');
const path = require('path');
const getDateInString = require('../utils/get-date-in-string');

const logData = (data, log_folder) => {
    const logData = JSON.stringify(data, null, 2);
    const currentDate = getDateInString(new Date(), 'YYYY-MM-DD');
    const logFileName = `${currentDate}.log`;
    const logFilePath = path.join(__dirname, `../log/${log_folder}`, logFileName);

    const logDir = path.dirname(logFilePath);

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFile(logFilePath, `${logData}\n`, (err) => {
        if (err) {
            console.error('Error writing log:', err);
        }
    });
};

module.exports = logData;