'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    return Promise.all([
      queryInterface.addColumn('users','naverId', {
        type: Sequelize.STRING(100),
        allowNull: true
      })
    ])
     
  },

  down: async (queryInterface, Sequelize) => {
     return Promise.all([
      queryInterface.addColumn('users','naverId', {
        type: Sequelize.STRING(100),
        allowNull: true
      })
     ])
  }
};
