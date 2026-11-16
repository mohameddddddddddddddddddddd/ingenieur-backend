import jwt from "jsonwebtoken";

export function generateToken(user) {
    return jwt.sign(
        {
            // jsonwebtoken exige que "sub" soit une chaîne
            sub: String(user.id),
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
}
