function validate(schema, property = "body") {
    return (req, res, next) => {
        const result = schema.safeParse(req[property]);
        if (!result.success) {
            return res.status(400).json({
                message: "Request validation failed",
                errors: result.error.issues.map(({ path, message }) => ({ path: path.join("."), message }))
            });
        }
        req[property] = result.data;
        next();
    };
}

module.exports = validate;
