const { STATUS_CODES } = require("../utils/constants");
const DatabaseErrorCode = require("./DatabaseErrorCode");

const DATABASE_ERROR_CODES = {
    'UNF00': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'UAE01': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'UAE02': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),

    'VNF00': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),

    'SNF00' : new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'SAE00' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),

    'FTNF0' : new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),

    'BNF00' : new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'BAE01' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'BU001' : new DatabaseErrorCode(STATUS_CODES.FORBIDDEN_403),

    'CNF00' : new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'CNF10' : new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404), 
    'CAE00' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'CAE01' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'CD001' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'CD002' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'CU001' : new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),
    'CU002' : new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),
    'CAS00' : new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),

    'PTNF0': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'PTM00' : new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),
    'PTAE0' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),

    'PTFNF' : new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'PTFAE' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),

    'BAE01' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'BAE02' : new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'BNF00': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'BD001': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),

    'TMNF0': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),

    'PAE01': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'PAE02': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'PNF00': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'PU001': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400, "Category cannot be updated because the product has variants, and the product type of the new category differs from the current one"),
    'PU002': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),
    'PD001': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),

    'PIAE0': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'PINF0': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'PID01': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),
    'PID02': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),

    'PVAE0': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'PVNF0': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),
    'PVD01': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),

    'PVFAE': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'PVFC0': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),
    'PVFNF': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),

    'ANF00': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),

    'DC001': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),
    'DC002': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),
    'DNF00': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),

    'RAE01': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'RNF00': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),

    'FAE01': new DatabaseErrorCode(STATUS_CODES.CONFLICT_409),
    'FNF00': new DatabaseErrorCode(STATUS_CODES.NOT_FOUND_404),

    'VRL00': new DatabaseErrorCode(STATUS_CODES.BAD_REQUEST_400),
};

module.exports = DATABASE_ERROR_CODES;