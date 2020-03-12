import Sequelize, { Model } from 'sequelize';

class Location extends Model {
  static init(sequelize) {
    super.init(
      {
        longitude: Sequelize.FLOAT,
        latitude: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.hasOne(models.User, { foreignKey: 'location_id', as: 'user' });
  }
}

export default Location;
