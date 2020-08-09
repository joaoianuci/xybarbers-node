module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'phone'),
};
