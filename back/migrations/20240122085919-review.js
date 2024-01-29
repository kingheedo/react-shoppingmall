'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.removeColumn(
      'reviews',
      'reviewUnique'
    )
    await queryInterface.addColumn(
      'payments',
      'isReviewed',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.addColumn(
      'reviews',
      'reviewUnique',
      {
        type: Sequelize.STRING(200), 
        unique: true 
      }
    )
    await queryInterface.removeColumn(
      'payments',
      'isReviewed'
    )
  }
};
