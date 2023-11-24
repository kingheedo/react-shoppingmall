'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'users',
      'orderId'
    );
    await queryInterface.removeColumn(
      'users',
      'paymentKey'
    );
    await queryInterface.removeColumn(
      'users',
      'paymentType'
    );
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn(
      'users',
      'orderId',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    await queryInterface.addColumn(
      'users',
      'paymentKey',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    await queryInterface.addColumn(
      'users',
      'paymentType',
      {
        type: Sequelize.ENUM('NORMAL','BRANDPAY','KEYIN'),
        allowNull: false
      }
    );
  }
};
