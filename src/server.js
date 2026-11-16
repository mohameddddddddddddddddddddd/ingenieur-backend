import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import donsRoutes from "./routes/dons.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import usersRoutes from "./routes/users.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET manquant dans .env");
    process.exit(1);
}

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "SangConnect API OK" }));

app.use("/api/auth", authRoutes);
app.use("/api/dons", donsRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/users", usersRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`SangConnect sur http://localhost:${port}`));
