'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
    'payments',
    'cancelled',
    );
    await queryInterface.removeColumn(
    'payments',
    'email',
    );
    await queryInterface.removeColumn(
    'payments',
    'paid',
    );
    await queryInterface.removeColumn(
    'payments',
    'payerID',
    );
    await queryInterface.removeColumn(
    'payments',
    'paymentID',
    );
    await queryInterface.removeColumn(
    'payments',
    'paymentToken',
    );
    await queryInterface.removeColumn(
    'payments',
    'returnUrl',
    );

  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn(
    'payments',
    'cancelled',
    );
    await queryInterface.addColumn(
    'payments',
    'email',
    );
    await queryInterface.addColumn(
    'payments',
    'paid',
    );
    await queryInterface.addColumn(
    'payments',
    'payerID',
    );
    await queryInterface.addColumn(
    'payments',
    'paymentID',
    );
    await queryInterface.addColumn(
    'payments',
    'paymentToken',
    );
    await queryInterface.addColumn(
    'payments',
    'returnUrl',
    );
  }
};
