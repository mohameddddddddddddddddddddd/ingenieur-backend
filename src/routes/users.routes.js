import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import { getAll, remove } from "../controllers/users.controller.js";

const router = express.Router();

// Gérer / supprimer les utilisateurs : ADMIN uniquement
router.get("/", authenticate, authorize("ADMIN"), getAll);
router.delete("/:id", authenticate, authorize("ADMIN"), remove);

export default router;
