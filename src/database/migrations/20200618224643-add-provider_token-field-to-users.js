module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'provider_token', {
      type: Sequelize.STRING,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('users', 'provider_token'),
};
