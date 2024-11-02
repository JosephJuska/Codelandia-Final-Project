const { STATUS_CODES } = require('../utils/constants');
const logData = require('../utils/log-data');
const DATABASE_ERROR_CODES = require('./database-error-codes');
const { DatabaseSuccess, DatabaseError } = require('./database-result');
const LoggingData = require('../utils/log-data-object');

const pool = require('./pool');

class ORM {
    constructor(pool) {
        this._pool = pool;
    }

    async makeRequest(query, data) {
        try{
            const result = await this._pool.query(query, data);
            this.logResponse(true, null, 'Query executed successfully', query, data, result?.rows);
            return new DatabaseSuccess(result);
        }catch(e){
            if(e?.code && DATABASE_ERROR_CODES[e.code]){
                const errorMessage = DATABASE_ERROR_CODES[e.code].message ? DATABASE_ERROR_CODES[e.code].message : e.message;
                const critical = DATABASE_ERROR_CODES[e.code].critical;
                const statusCode = DATABASE_ERROR_CODES[e.code].statusCode;
                this.logResponse(false, e, critical ? 'Critical database error' : 'Database error', query, data, null);
                return new DatabaseError(statusCode, errorMessage, e.code, critical);
            }

            this.logResponse(false, e, 'Critical database error', query, data, null);
            return new DatabaseError(STATUS_CODES.SERVER_ERROR_500, e?.message, e?.code, true);
        }
    }

    logResponse(success, error, message, query, data, result) {
        const logEntry = new LoggingData(
            message,
            {
                query,
                data,
                result
            },
            success ? null : error
        );

        logData(logEntry, 'db');
    }
};

const orm = new ORM(pool);
module.exports = orm;