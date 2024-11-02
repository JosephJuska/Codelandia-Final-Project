import { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } from "../../default-validators";

import validator from '../../validator';

const validateAnnouncementSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateAnnouncementSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateAnnouncementSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['newest', 'oldest', 'titleASC', 'titleDESC']);
};

const validateAnnouncementSort = async (sort) => {
    return await validator(sort, [], [validateAnnouncementSortIsString, validateAnnouncementSortContainsCorrectValue], validateAnnouncementSortIsProvided);
};

export default validateAnnouncementSort;