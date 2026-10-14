const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const header = req.headers.authorization;
    const [scheme, token] = header ? header.split(" ") : [];

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = authenticateToken;
