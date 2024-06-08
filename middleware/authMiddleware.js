const { StatusCodes } = require("http-status-codes"); 
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.header('Authorization'); 
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Authentication invalid' });
    }
    const token = authHeader.split(" ")[1]; 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Assuming your JWT contains all necessary user information
        next();
    } catch (error) {
        console.error("JWT verification error:", error); // Log the JWT verification error
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "UnAuthorized user" });
    }
}

module.exports = authMiddleware;
