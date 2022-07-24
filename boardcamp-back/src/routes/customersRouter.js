import { Router } from "express";
import {
  createCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from "../controllers/customerController.js";
import { validateCustomer } from "../middlewares/customerValidation.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.post("/customers", validateCustomer, createCustomer);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.put("/customers", validateCustomer, updateCustomer);

export default customersRouter;
