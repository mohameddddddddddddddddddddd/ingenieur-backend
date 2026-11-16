import * as authService from "../services/auth.service.js";

export async function register(req, res, next) {
    try {
        const user = await authService.register(req.body);
        res.status(201).json(authService.toPublicUser(user));
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const result = await authService.login(req.body.email, req.body.password);
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function me(req, res, next) {
    try {
        const user = await authService.me(Number(req.user.sub));
        res.json(user);
    } catch (error) {
        next(error);
    }
}
