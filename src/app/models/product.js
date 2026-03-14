import Sequelize, { Model } from "sequelize";

class Product extends Model {
    static init(sequelize) {
        // biome-ignore lint/complexity/noThisInStatic: O Sequelize exige super.init em métodos estáticos
        super.init(
            {
                name: Sequelize.STRING,
                price: Sequelize.INTEGER,
                category: Sequelize.STRING,
                path: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `http://localhost:3001/product-file/${this.path}`;
                    },
                },
            },
            {
                sequelize,
                tableName: 'products',
                underscored: true,
            },
        );

        // biome-ignore lint/complexity/noThisInStatic: O Sequelize exige retornar a própria classe (this) no init
        return this;
    }
}

export default Product;