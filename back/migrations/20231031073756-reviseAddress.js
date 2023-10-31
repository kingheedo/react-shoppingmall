'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('addresses', 'rcName', {type: Sequelize.STRING(20), allowNull: false});
    await queryInterface.addColumn('addresses', 'rcPhone', {type: Sequelize.STRING(11), allowNull : false});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('addresses', 'rcName');
    await queryInterface.removeColumn('addresses', 'rcPhone');
  }
};
