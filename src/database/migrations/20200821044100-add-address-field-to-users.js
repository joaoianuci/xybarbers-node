module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'address_id', {
      type: Sequelize.INTEGER,
      references: { model: 'addresses', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'address_id'),
};
