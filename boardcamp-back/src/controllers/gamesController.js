import connection from "../dbStrategy/postgres.js";

export async function getGames(req, res) {
  const { name } = req.query;

  try {
    const params = [];
    let filter = "";

    if (name) {
      params.push(`${name}%`);
      filter += `WHERE games.name ILIKE $${params.length}`;
    }

    const games = await connection.query(
      `
            SELECT games.*, categories.name AS "categoryName" FROM games
            JOIN categories ON categories.id=games."categoryId"
            ${filter}
          `,
      params
    );

    res.send(games.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function createGame(req, res) {
  const game = req.body;

  try {
    await connection.query(
      `
    INSERT INTO games(name, image, "stockTotal", "categoryId", "pricePerDay")
    VALUES ($1, $2, $3, $4, $5);
  `,
      [
        game.name,
        game.image,
        Number(game.stockTotal),
        game.categoryId,
        Number(game.pricePerDay),
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
