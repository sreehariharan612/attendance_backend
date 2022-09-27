'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Assignment}) {
      this.hasMany(Assignment, {
        foreignKey: {
          name: "staff_pk_id",
          type: DataTypes.INTEGER,
        },
        onDelete: "SET NULL",
      });
      // define association here
    }
  }
  Staff.init({
    staffid: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    }
  }, {
    sequelize,
    modelName: 'Staff',
  });
  return Staff;
};