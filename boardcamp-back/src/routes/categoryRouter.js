import { Router } from "express";
import {
  getCategories,
  createCategory,
} from "../controllers/categoryController.js";

import { validateCategory } from "../middlewares/categoryValidation.js";

const categoryRouter = Router();

categoryRouter.get("/categories", getCategories);
categoryRouter.post("/categories", validateCategory, createCategory);

export default categoryRouter;
