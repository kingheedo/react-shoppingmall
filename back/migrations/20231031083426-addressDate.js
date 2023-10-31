'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn('addresses', 'createdAt', {type: Sequelize.DATE});
    queryInterface.addColumn('addresses', 'updatedAt',{type: Sequelize.DATE});
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('addresses', 'createdAt');
    queryInterface.removeColumn('addresses', 'updatedAt');
  }
};
