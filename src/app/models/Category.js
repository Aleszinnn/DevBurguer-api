import Sequelize, { Model } from "sequelize";

class Category extends Model {
    static init(sequelize) {
        // O Biome considera confuso o uso de 'this' ou 'super' em métodos estáticos.
        // No entanto, o Sequelize exige esta estrutura para inicializar o modelo.
        
        // biome-ignore lint/complexity/noThisInStatic: Necessário para o funcionamento do Sequelize
        super.init(
            {
                name: Sequelize.STRING,
            },
            {
                sequelize,
                tableName: 'categories',
                underscored: true,
            },
        );

        // biome-ignore lint/complexity/noThisInStatic: O Sequelize exige retornar a própria classe (this) no init
        return this;
    }
}

export default Category;