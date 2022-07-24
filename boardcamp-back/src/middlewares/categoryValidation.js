import categorySchema from "../schemas/categorySchema.js";
import connection from "../dbStrategy/postgres.js";

export default async function validateCategory(req, res, next) {
  const category = req.body;
  const validation = categorySchema.validate(category);
  if (validation.error) {
    return res.sendStatus(400);
  }
  try {
    const checkName = await connection.query(
      `SELECT id FROM categories WHERE name = $1`,
      [category.name]
    );
    if (checkName.rowCount > 0) {
      return res.status(409).send("Já existe uma categoria com esse nome");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
