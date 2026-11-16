import * as userRepository from "../repositories/user.repository.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";

function httpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

export function toPublicUser(user) {
    return {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
    };
}

export async function register(data) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
        throw httpError("Cette adresse email est déjà utilisée", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    return userRepository.create({
        nom: data.nom,
        email: data.email,
        password: hashedPassword,
        role: data.role // undefined => valeur par défaut AGENT_CENTRE
    });
}

export async function login(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw httpError("Email ou mot de passe incorrect", 401);
    }

    const valid = await verifyPassword(user.password, password);

    if (!valid) {
        throw httpError("Email ou mot de passe incorrect", 401);
    }

    return {
        token: generateToken(user),
        user: toPublicUser(user)
    };
}

export async function me(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw httpError("Utilisateur introuvable", 404);
    }

    return toPublicUser(user);
}
