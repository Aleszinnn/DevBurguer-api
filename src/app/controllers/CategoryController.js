import * as Yup from "yup";
import Category from "../models/Category";

class CategoryController {
    async store(req, res) {
        const schema = Yup.object({
            name: Yup.string().required(),
        });

        try {
            // Adicionado await, pois validate é assíncrono
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        const { name } = req.body;

        const category = await Category.create({
            name,
        });

        return res.status(201).json(category);
    }

    // Alterado para _req para resolver o erro do linter (parâmetro não utilizado)
    async index(_req, res) {
        const categories = await Category.findAll();

        return res.json(categories);
    }
}

export default new CategoryController();