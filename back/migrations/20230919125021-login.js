'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    return Promise.all([
      queryInterface.changeColumn('users','email',{
      type: Sequelize.STRING(30),
      allowNull : true,
      unique : true,
      defaultValue: null
    }),
    queryInterface.changeColumn('users','name',{
      type: Sequelize.STRING(30),
      allowNull : false,
      unique: false,
    }),
     queryInterface.changeColumn('users','password',{
      type: Sequelize.STRING(100),
      allowNull : true,
      defaultValue: null
    })
    ])
     
  },

  down: async (queryInterface, Sequelize) => {
     return Promise.all([
       queryInterface.changeColumn('users','email',{
      type: Sequelize.STRING(30),
      allowNull : false,
      unique : true,
    }),
    queryInterface.changeColumn('users','name',{
      type: Sequelize.STRING(30),
      allowNull : false,
      unique: false,
    }),
     queryInterface.changeColumn('users','password',{
      type: Sequelize.STRING(100),
      allowNull : false,
    })
     ])
  }
};
