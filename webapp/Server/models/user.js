'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    verified_on: DataTypes.DATE

    
  }, {
    sequelize,
    modelName: 'User',
    //change default attribute name createdAt as account_created
    createdAt:'account_created',
    updatedAt:'account_updated'
  });
  
  return User;
};