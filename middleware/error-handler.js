errorHandler = (err, req, res, next) => {
    var errRes = { status: 500, message: "An unknown error has occurred" };
    if (err.name === "MongoError") {
        if (err.code === 11000) errRes = { status: 400, message: Object.getOwnPropertyNames(err.keyValue)[0].replace(/^\w/, c => c.toUpperCase()) + " is already taken" };
    } else if (typeof err === "string") {
        if (/does not exist$/.test(err)) errRes = { status: 404, message: err };
    }
    return res.status(errRes.status).send(errRes.message);
}

module.exports = errorHandler;