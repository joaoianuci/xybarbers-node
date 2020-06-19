module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'provider_validate', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('users', 'provider_validate'),
};
