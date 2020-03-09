import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        number: Sequelize.INTEGER,
        street: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        city: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasOne(models.File, { foreignKey: 'user_id', as: 'avatar' });
    this.hasOne(models.Location, { foreignKey: 'user_id', as: 'point' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
