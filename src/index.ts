import { container } from "./config/container";
import express from "express";
import { MusicController } from "./adapters/driving/musicController";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Résolution automatique des dépendances du contrôleur par tsyringe
const musicController = container.resolve(MusicController);
musicController.registerRoutes(app);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});