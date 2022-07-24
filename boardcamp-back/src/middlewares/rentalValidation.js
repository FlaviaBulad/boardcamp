import rentalSchema from "../schemas/rentalSchema.js";

export function validateRental(req, res, next) {
  const rental = req.body;
  const validation = rentalSchema.validate(rental, { abortEarly: false });
  if (validation.error) {
    return res.sendStatus(400);
  }

  next();
}
