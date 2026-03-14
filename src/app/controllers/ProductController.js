import * as Yup from "yup";
import Product from "../models/product";

class ProductController {
    async store(req, res) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category: Yup.string().required(),
            // path: Yup.string().required(),
        });

        try {
            // validateSync é síncrono, então o try/catch funciona corretamente aqui
            schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        const { filename: path } = req.file;
        const { name, price, category } = req.body;

        const product = await Product.create({
            name,
            price,
            category,
            path,
        });

        return res.status(201).json(product);
    }

    // Alterado para _req para resolver o erro 'noUnusedFunctionParameters' do Biome
    async index(_req, res) {
        const products = await Product.findAll();
        
        // Alterado de 201 para 200 (status correto para listagem/sucesso)
        return res.status(200).json(products);
    }
}

export default new ProductController();