import Sequelize, { Model } from 'sequelize';

class Rating extends Model {
  static init(sequelize) {
    super.init(
      {
        rating: {
          type: Sequelize.INTEGER,
          validate: {
            min: 1,
            max: 5,
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'rater_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'rated_id', as: 'provider' });
  }
}

export default Rating;
