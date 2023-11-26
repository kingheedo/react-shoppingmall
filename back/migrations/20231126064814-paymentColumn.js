'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn(
      'payments',
      'rcName',
      {
        type: Sequelize.STRING(20),
        allowNull: false,
        });
    await queryInterface.addColumn(
      'payments',
      'rcPhone',
      {
        type: Sequelize.STRING(11),
        allowNull: false,
        });
    await queryInterface.addColumn(
      'payments',
      'rcPostNum',
      {
        type: Sequelize.STRING(5),
        allowNull: false,
        });
    await queryInterface.addColumn(
      'payments',
      'rcPostBase',
      {
        type: Sequelize.STRING(100),
        allowNull: false,
        });
    await queryInterface.addColumn(
      'payments',
      'rcPostDetail',
      {
        type: Sequelize.STRING(100),
        allowNull: false,
        });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn(
      'payments',
      'rcName',
      {
        type: Sequelize.STRING(20),
        allowNull: false,
        });
    await queryInterface.removeColumn(
      'payments',
      'rcPhone',
      {
        type: Sequelize.STRING(11),
        allowNull: false,
        });
    await queryInterface.removeColumn(
      'payments',
      'rcPostNum',
      {
        type: Sequelize.STRING(5),
        allowNull: false,
        });
    await queryInterface.removeColumn(
      'payments',
      'rcPostBase',
      {
        type: Sequelize.STRING(100),
        allowNull: false,
        });
    await queryInterface.removeColumn(
      'payments',
      'rcPostDetail',
      {
        type: Sequelize.STRING(100),
        allowNull: false,
        });
  }
};
