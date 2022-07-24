import gameSchema from "../schemas/gameSchema.js";
import connection from "../dbStrategy/postgres.js";

export default async function validateGame(req, res, next) {
  const game = req.body;
  const validation = gameSchema.validate(game, { abortEarly: false });
  if (validation.error) {
    return res.sendStatus(400);
  }
  try {
    const categories = await connection.query(
      `SELECT * FROM categories WHERE id = $1`,
      [game.categoryId]
    );
    if (categories.rowCount === 0) {
      return res.sendStatus(400);
    }

    const games = await connection.query(
      `SELECT * FROM games WHERE name ILIKE $1`,
      [game.name]
    );

    if (games.rowCount > 0) {
      return res.sendStatus(409);
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
