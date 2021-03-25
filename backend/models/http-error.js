class HttpError extends Error {
    constructor(message, errorCode){
        super(message);
        this.code = errorCode   // adds a code property
    }
}

module.exports = HttpError;