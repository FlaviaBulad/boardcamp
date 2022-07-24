import { func } from "joi";
import connection from "../dbStrategy/postgres.js";

export default async function getCategories(req, res) {
  try {
    const { rows: categories } = connection.query(`SELECT * FROM categories`);
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Não foi possível pegar as categorias");
  }
}

export default async function createCategory(req, res){
  const category = req.body;
  

}
