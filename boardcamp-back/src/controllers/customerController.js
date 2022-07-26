import connection from "../dbStrategy/postgres.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    const params = [];
    let filter = "";

    if (cpf) {
      filter += `WHERE cpf ILIKE $${params.length}`;
      params.push(`${cpf}%`);
    }

    const customers = await connection.query(
      `
      SELECT * FROM customers
      ${filter}
    `,
      params
    );
    res.send(customers.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function createCustomer(req, res) {
  const customer = req.body;
  try {
    const search = await connection.query(
      "SELECT id FROM customers WHERE cpf = $1",
      [customer.cpf]
    );
    if (search.rowCount > 0) {
      return res.sendStatus(409);
    }

    await connection.query(
      `
    INSERT INTO customers (name, phone, cpf, birthday) 
    VALUES ($1, $2, $3, $4);
  `,
      [customer.name, customer.phone, customer.cpf, customer.birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const customer = await connection.query(
      `SELECT * FROM customers WHERE id = $1`,
      [id]
    );

    if (customer.rowCount === 0) {
      return res.status(404).send("Cliente não encontrado");
    }
    res.send(customer.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function updateCustomer(req, res) {
  const customer = req.body;
  const { id } = req.params;

  try {
    const search = await connection.query(
      `
    SELECT id FROM customers WHERE cpf = $1 AND id != $2
  `,
      [customer.cpf, id]
    );
    if (search.rowCount > 0) {
      return res.sendStatus(409);
    }

    await connection.query(
      `
    UPDATE customers 
    SET 
      name = $1, 
      phone = $2, 
      cpf = $3, 
      birthday = $4 
    WHERE id = $5
  `,
      [customer.name, customer.phone, customer.cpf, customer.birthday, id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
