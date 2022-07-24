import { Router } from "express";
import { createRent, getRentals } from "../controllers/rentalsController.js";
import { validateRental } from "../middlewares/rentalValidation.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRental, createRent);

export default rentalsRouter;
