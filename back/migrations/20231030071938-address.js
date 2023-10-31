'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('addresses', 'postNum', 'rcPostNum' );
    await queryInterface.renameColumn('addresses', 'base', 'rcPostBase' );
    await queryInterface.renameColumn('addresses', 'detail', 'rcPostDetail' );

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('addresses', 'rcPostNum', 'postNum' );
    await queryInterface.renameColumn('addresses', 'rcPostBase', 'base' );
    await queryInterface.renameColumn('addresses', 'rcPostDetail', 'detail' );
  }
};
