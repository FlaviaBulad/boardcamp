import connection from "../dbStrategy/postgres.js";

export async function getCategories(req, res) {
  try {
    const { rows: categories } = connection.query(`SELECT * FROM categories`);
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Não foi possível pegar as categorias");
  }
}

export async function createCategory(req, res) {
  const category = req.body;

  try {
    await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [
      category.name,
    ]);

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send("Não foi possível adicionar uma categoria");
  }
}
