'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    
    await queryInterface.changeColumn('reviewImages','ReviewId',{
        allowNull: true,
        type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('reviewImages','ReviewId',{
        allowNull: false,
        type: Sequelize.INTEGER
    });
  }
};
