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

// export async function createRent(req, res) {
//   const rental = req.body;
//   try {
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
//   }
// }
