class ObjectNotFound extends Error {
    constructor(msg) {
        super(msg);
    }
}

module.exports = ObjectNotFound;