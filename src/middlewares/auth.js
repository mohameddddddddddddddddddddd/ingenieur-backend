import jwt from "jsonwebtoken";

function unauthorized(message) {
    const error = new Error(message);
    error.statusCode = 401;
    return error;
}

export function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization;

        if (!header) {
            throw unauthorized("Token manquant");
        }

        const [type, token] = header.split(" ");

        if (type !== "Bearer" || !token) {
            throw unauthorized("Format du token invalide");
        }

        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(unauthorized("Token expiré"));
        }
        if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
            return next(unauthorized("Token invalide"));
        }
        if (!error.statusCode) {
            error.statusCode = 401;
        }
        next(error);
    }
}
