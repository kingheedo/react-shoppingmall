'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'payments',
      'orderId',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    await queryInterface.addColumn(
      'payments',
      'paymentKey',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    await queryInterface.addColumn(
      'payments',
      'paymentType',
      {
        type: Sequelize.ENUM('NORMAL','BRANDPAY','KEYIN'),
        allowNull: true
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn(
      'payments',
      'orderId',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    await queryInterface.removeColumn(
      'payments',
      'paymentKey',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
    await queryInterface.removeColumn(
      'payments',
      'paymentType',
      {
        type: Sequelize.ENUM('NORMAL','BRANDPAY','KEYIN'),
        allowNull: false,
        defaultValue: ''
      }
    );
  }
};
