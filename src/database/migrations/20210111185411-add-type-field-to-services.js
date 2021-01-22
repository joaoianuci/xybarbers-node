module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('services', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    }),

  down: queryInterface => queryInterface.removeColumn('services', 'type'),
};
