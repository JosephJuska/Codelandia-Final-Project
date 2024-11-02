import { validateIsProvided, validateIsCorrectType, validateIsInteger, validateIsPositive, validateIsInRange } from "../../default-validators";

import validator from '../../validator';

const validateProductStockIsProvided = (stock) => {
    return validateIsProvided(stock, 'stock');
};

const validateProductStockIsNumber = (stock) => {
    return validateIsCorrectType(stock, 'stock', 'number');
};

const validateProductStockIsInteger = (stock) => {
    return validateIsInteger(stock, 'stock');
};

const validateProductStockIsPositive = (stock) => {
    return validateIsPositive(stock, 'stock');
};

const validateProductStockIsInRange = (stock) => {
    return validateIsInRange(stock, 'stock', 0, 10000000);
};

const validateProductStock = async (stock) => {
    return await validator(stock, [], [validateProductStockIsNumber, validateProductStockIsInteger, validateProductStockIsPositive, validateProductStockIsInRange], validateProductStockIsProvided);
};

export default validateProductStock;