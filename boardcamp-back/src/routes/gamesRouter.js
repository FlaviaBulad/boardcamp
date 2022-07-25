import { Router } from "express";
import { createGame, getGames } from "../controllers/gamesController.js";
import { validateGame } from "../middlewares/gameValidation.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateGame, createGame);

export default gamesRouter;
