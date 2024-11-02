import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

const handleSentDate = (date) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parsedDate = date.tz(userTimeZone).local().toISOString();
    return parsedDate;
};

const handleReceivedDate = (date) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parsedDate = dayjs(date).tz(userTimeZone).local();
    return parsedDate;
};

export default {
    handleSentDate,
    handleReceivedDate
};