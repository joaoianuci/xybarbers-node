module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('services', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    }),

  down: queryInterface => queryInterface.removeColumn('services', 'name'),
};
