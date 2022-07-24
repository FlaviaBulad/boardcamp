import customerSchema from "../schemas/customerSchema.js";

export function validateCustomer(req, res, next) {
  const customer = req.body;
  const validation = customerSchema.validate(customer, { abortEarly: false });
  if (validation.error) {
    return res.sendStatus(400);
  }

  next();
}
