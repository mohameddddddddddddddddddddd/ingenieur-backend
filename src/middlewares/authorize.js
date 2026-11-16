export function authorize(...rolesAutorises) {
    return (req, res, next) => {
        if (!req.user) {
            const error = new Error("Authentification requise");
            error.statusCode = 401;
            return next(error);
        }

        if (!rolesAutorises.includes(req.user.role)) {
            const error = new Error("Accès interdit : rôle insuffisant");
            error.statusCode = 403;
            return next(error);
        }

        next();
    };
}
