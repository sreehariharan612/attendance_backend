'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Staff , Attendance}) {

      

      this.belongsTo(Staff, {
        foreignKey: {
          name: "staff_pk_id",
          type: DataTypes.INTEGER,
        },
        onDelete: "SET NULL",
      });

      this.hasMany(Attendance, {
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
  Assignment.init({
    subjectcode:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    } ,
    subjectname:{
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isIn: [["IT", "CS", "ALL"]],
      },
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    batch: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  }, {
    sequelize,
    modelName: 'Assignment',
  });
  return Assignment;
};