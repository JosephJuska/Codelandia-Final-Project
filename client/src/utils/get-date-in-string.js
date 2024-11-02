import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);

const getDateInString = (date, includeTime = false) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return dayjs.utc(date).tz(userTimeZone).format(includeTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD');
};

export default getDateInString;