import Category from "../models/Category";
import Product from "../models/product";
import * as Yup from 'yup';
import Order from '../schemas/Order';

class OrderController {
    async store(req, res) {
       const schema = Yup.object({
            products: Yup.array()
            .required()
             .of(
                Yup.object({
                    id: Yup.number().required(),
                }),
             )
        });

        try {
            schema.validateSync(req.body, { abortEarly: false, strict: true });
        } catch (err) {
  console.log('--- ERRO DETALHADO DO POSTGRES ---');
  console.log(err.parent.detail || err.message); 
  console.log('---------------------------------');
  return response.status(500).json({ error: 'Erro no banco de dados' });
}

        const { userId, userName } = req;
        const { products } = req.body

        const productsIds = products.map((product) => product.id)

        const findedProducts = await Product.findAll({
            where: {
                id: productsIds,
            },
            include: {
                model: Category,
                as: "category",
                attributes: ["name"]
            }
        })

        const mapedProducts = findedProducts.map(product => {

            const quantity = product.find((p) => p.id === product.id)
            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                url: product.url,
                category: product.category.name,
            }
            return newProduct
        })
        const order = {
            user: {
                id: req.userId,
                name: req.userName
            },
            product: mapedProducts,
            status: "Pedido realizado"
        }

        const newOrder = await Order.create(order);

        return res.status(201).json(newOrder);
    }

}

export default new OrderController();