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
      },
    );

    return this;
  }
}

export default Location;
