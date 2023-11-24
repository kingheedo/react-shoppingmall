'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn(
      'users',
      'orderId',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    await queryInterface.removeColumn(
      'users',
      'paymentKey',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    await queryInterface.removeColumn(
      'users',
      'paymentType',
      {
        type: Sequelize.ENUM('NORMAL','BRANDPAY','KEYIN'),
        allowNull: false
      }
    );
  }
};
