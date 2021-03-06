module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('services', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    }),

  down: queryInterface => queryInterface.removeColumn('services', 'name'),
};
