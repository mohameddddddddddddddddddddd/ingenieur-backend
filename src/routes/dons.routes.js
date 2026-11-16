import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// Consulter les dons : tous les rôles
router.get("/", authenticate, (req, res) => {
    res.json({ message: "Liste des dons", demandePar: req.user.email, dons: [] });
});

// Créer un don : ADMIN + AGENT_CENTRE
router.post("/", authenticate, authorize("ADMIN", "AGENT_CENTRE"), (req, res) => {
    res.status(201).json({ message: "Don créé (démo)" });
});

export default router;
