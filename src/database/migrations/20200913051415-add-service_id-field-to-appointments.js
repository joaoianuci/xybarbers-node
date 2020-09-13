module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('appointments', 'service_id', {
      type: Sequelize.INTEGER,
      references: { model: 'services', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
    }),

  down: queryInterface =>
    queryInterface.removeColumn('appointments', 'service_id'),
};
