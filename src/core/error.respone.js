const StatusCode = {
    FORBIDEN: 403,
    CONFLICT: 409,
    Unauthorized: 401,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
}

const ReasonStatusCode = {
    FORBIDEN: "Bad request error",
    CONFLICT: "Conflict error"
}

class ErrorRespone extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflicRequestError extends ErrorRespone {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorRespone {
    constructor(message = ReasonStatusCode.FORBIDEN, statusCode = StatusCode.FORBIDEN) {
        super(message, statusCode)
    }
}

class AuthFailError extends ErrorRespone {
    constructor(message = ReasonStatusCode.FORBIDEN, statusCode = StatusCode.UNAUTHORIZED) {
        super(message, statusCode)
    }
}
class NodeFoundError extends ErrorRespone {
    constructor(message = ReasonStatusCode.FORBIDEN, statusCode = StatusCode.NOT_FOUND) {
        super(message, statusCode)
    }
}

module.exports = {
    ConflicRequestError,
    BadRequestError,
    AuthFailError,
    NodeFoundError
}