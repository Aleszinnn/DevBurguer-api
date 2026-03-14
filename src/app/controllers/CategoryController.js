import * as Yup from "yup";
import Category from "../models/Category";

class CategoryController {
    async store(req, res) {
        const schema = Yup.object({
            name: Yup.string().required(),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        const { name } = req.body;
        const { filename: path } = req.file;

        const categoryExists = await Category.findOne({
            where: { name },
        });

        if (categoryExists) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const newCategory = await Category.create({
            name,
            path,
        });

        return res.status(201).json(newCategory);
    }

    async index(_req, res) {
        const categories = await Category.findAll();
        return res.json(categories);
    }
}

export default new CategoryController();