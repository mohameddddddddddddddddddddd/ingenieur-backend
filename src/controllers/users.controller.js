import * as userRepository from "../repositories/user.repository.js";

export async function getAll(req, res, next) {
    try {
        res.json(await userRepository.findAll());
    } catch (error) {
        next(error);
    }
}

export async function remove(req, res, next) {
    try {
        const id = Number(req.params.id);
        const user = await userRepository.findById(id);

        if (!user) {
            const error = new Error("Utilisateur introuvable");
            error.statusCode = 404;
            throw error;
        }

        await userRepository.remove(id);
        res.json({ message: "Utilisateur supprimé" });
    } catch (error) {
        next(error);
    }
}
