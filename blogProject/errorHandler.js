function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    if (err.code === "23505") {
        return res.status(409).json({ message: "A record with that value already exists" });
    }

    const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600
        ? err.status
        : 500;
    if (status >= 500) console.error(err);
    return res.status(status).json({
        message: status === 500 ? "Internal server error" : err.message
    });
}

module.exports = errorHandler;
