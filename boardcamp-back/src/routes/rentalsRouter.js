import { Router } from "express";
import {
  createRent,
  deleteRental,
  finishRent,
  getRentals,
} from "../controllers/rentalsController.js";
import { validateRental } from "../middlewares/rentalValidation.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRental, createRent);
rentalsRouter.post("/rentals/:id/return", finishRent);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
