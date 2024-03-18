'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('images', 'src', {
      type : Sequelize.STRING(200),
      allowNull : true,
    })
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.changeColumn('images', 'src', {
      type : Sequelize.STRING(200),
      allowNull : false,
    })
  }
};
