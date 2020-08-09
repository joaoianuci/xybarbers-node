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
        phone: Sequelize.STRING,
        bio: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        number: Sequelize.INTEGER,
        street: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        city: Sequelize.STRING,
        password_reset_token: {
          type: Sequelize.STRING,
          defaultValue: null,
        },
        password_reset_expires: {
          type: Sequelize.DATE,
          defaultValue: null,
        },
        provider_token: {
          type: Sequelize.STRING,
          defaultValue: null,
        },
        provider_validate: {
          type: Sequelize.BOOLEAN,
        },
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasOne(models.File, { foreignKey: 'user_id', as: 'avatar' });
    this.hasOne(models.Location, { foreignKey: 'user_id', as: 'point' });
  }

  async checkPassword(password) {
    const check = await bcrypt.compare(password, this.password_hash);
    return check;
  }

  filteredUser(user) {
    user.password = undefined;
    user.password_hash = undefined;
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    user.provider_token = undefined;

    return user;
  }
}

export default User;
