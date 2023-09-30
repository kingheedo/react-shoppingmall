'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("addresses",{
      id: {
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postNum: {
      type: Sequelize.STRING(5),
      allowNull:false
    },
    base:{ 
      type: Sequelize.STRING(100),
      allowNull: false
    },
    detail: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    UserId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("addresses",{
      id: {
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postNum: {
      type: Sequelize.STRING(5),
      allowNull:false
    },
    base:{ 
      type: Sequelize.STRING(100),
      allowNull: false
    },
    detail: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    UserId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
    })
  }
};
