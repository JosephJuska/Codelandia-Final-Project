const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const getDateInString = (date, format = null) => {
    const parsedDate = dayjs(date);

    return format ? parsedDate.format(format) : parsedDate.toISOString();
};

module.exports = getDateInString;