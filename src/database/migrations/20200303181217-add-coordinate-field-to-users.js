module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'location_id', {
    type: Sequelize.INTEGER,
    references: { model: 'locations', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    allowNull: true,
  }),

  down: (queryInterface) => queryInterface.removeColumn('users', 'location_id'),
};
