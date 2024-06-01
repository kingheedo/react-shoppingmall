'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.changeColumn('reviewimages', 'src', {
      type: Sequelize.STRING,
      allowNull:false
     });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('reviewimages', 'src', {
      type: Sequelize.STRING(200),
      allowNull:false
     });
  }
};
