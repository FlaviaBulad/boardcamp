import connection from "../dbStrategy/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;

  try {
    let filter = "";
    const params = [];
    const conditions = [];

    if (customerId) {
      params.push(customerId);
      conditions.push(`rentals."customerId" = $${params.length}`);
    }

    if (gameId) {
      params.push(gameId);
      conditions.push(`rentals."gameId"=$${params.length}`);
    }

    if (params.length > 0) {
      filter += `WHERE ${conditions.join(" AND ")}`;
    }

    const search = await connection.query(
      `
        SELECT 
          rentals.*,
          customers.name AS customer,
          games.name,
          categories.*
        FROM rentals
          JOIN customers ON customers.id=rentals."customerId"
          JOIN games ON games.id=rentals."gameId"
          JOIN categories ON categories.id=games."categoryId"
        ${filter}
      `,
      params
    );
    res.send(search.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function createRent(req, res) {
  const rental = req.body;
  try {
    const searchCustomer = await connection.query(
      `
    SELECT id FROM customers WHERE id = $1
  `,
      [rental.customerId]
    );

    if (searchCustomer.rowCount === 0) {
      return res.sendStatus(400);
    }

    const searchGame = await connection.query(
      `
    SELECT * FROM games WHERE id = $1
  `,
      [rental.gameId]
    );

    if (searchGame.rowCount === 0) {
      return res.sendStatus(400);
    }
    const game = searchGame.rows[0];

    const searchRental = await connection.query(
      `SELECT id
      FROM rentals 
      WHERE "gameId" = $1 AND "returnDate" IS null
    `,
      [rental.gameId]
    );

    if (searchRental.rowCount > 0) {
      if (game.stockTotal === searchRental.rowCount) {
        return res.sendStatus(400);
      }
    }

    const originalPrice = rental.daysRented * game.PricePerDay;

    await connection.query(
      `
INSERT INTO 
  rentals (
    "customerId", "gameId", "rentDate", 
    "daysRented", "returnDate", "originalPrice", "delayFee"
  )
  VALUES ($1, $2, NOW(), $3, null, $4, null); 
`,
      [rental.customerId, rental.gameId, rental.daysRented, originalPrice]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function finishRent() {}
