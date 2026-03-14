import * as Yup from "yup";
import Product from "../models/product";
import Category from "../models/Category";

class ProductController {
    async store(req, res) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean()
        });

        try {
            schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        const { filename } = req.file;
        const { name, price, category_id, offer } = req.body;

        const product = await Product.create({
            name,
            price,
            category_id,
            path: filename,
            offer
        });

        return res.status(201).json(product);
    }

    async update(req, res) {
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
        })

        try {
            schema.validateSync(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ error: err.errors });
        }

        const { name, price, category_id, offer } = req.body;
        const { id } = req.params;

        let path 
        if(req.file){
        const { filename} = req.file;
        path: filename; 

        }


        const updateProduct = await Product.create({
            name,
            price,
            category_id,
            path,
            offer
        }, {
            where: {
                id,
            },
        });

        return res.status(201).json(updateProduct);

    }

    async index(_request, response) {
        const Products = await Product.findAll({
            include: {
                model: Category,
                as: "category",
                attributes: ["id", "name"],

            }
        });

        return response.status(201).json(Products);
    }
}

export default new ProductController();