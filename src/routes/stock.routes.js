import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// Modifier le stock : ADMIN + RESPONSABLE_STOCK
router.put("/", authenticate, authorize("ADMIN", "RESPONSABLE_STOCK"), (req, res) => {
    res.json({ message: "Stock modifié (démo)" });
});

export default router;
