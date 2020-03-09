import Sequelize, { Model } from 'sequelize';

class Location extends Model {
  static init(sequelize) {
    super.init(
      {
        longitude: Sequelize.FLOAT,
        latidude: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Location;
