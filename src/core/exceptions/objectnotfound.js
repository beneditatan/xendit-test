const ErrorCode = require('../enums/errorcode');

class ObjectNotFound extends Error {
    constructor(msg) {
        super(msg);
        this.errorCode = ErrorCode.RIDES_NOT_FOUND_ERROR;
    }
}

module.exports = ObjectNotFound;