import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    // biome-ignore lint/complexity/noThisInStatic: O Sequelize exige super.init em métodos estáticos
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'users',
        // Se o erro persistir mesmo com a migration rodada, 
        // adicione 'underscored: true' para garantir o mapeamento de snake_case
        underscored: true,
      }
    );

    // biome-ignore lint/complexity/noThisInStatic: Hooks do Sequelize em métodos estáticos usam 'this'
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    // biome-ignore lint/complexity/noThisInStatic: O Sequelize exige retornar a própria classe (this) no init
    return this;
  }

  // Método para comparar a senha enviada com o hash do banco
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;