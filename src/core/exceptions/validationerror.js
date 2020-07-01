const ErrorCode = require('../enums/errorcode');

class ValidationError extends Error {
    constructor(msg) {
        super(msg);
        this.errorCode = ErrorCode.VALIDATION_ERROR;
    }
}

module.exports = ValidationError;