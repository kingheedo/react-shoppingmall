'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('images','src',{
      type: Sequelize.STRING(1000),
      allowNull: false
    })
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.changeColumn('images','src',{
      type: Sequelize.STRING(200),
      allowNull: true
    })
  }
};
