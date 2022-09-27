'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Assignment }) {
      this.belongsTo(Assignment, {
        foreignKey: {
          name: "subject_pk_id",
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
      // define association here
    }
  }
  Attendance.init({
    hours:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: 1,
      },
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};