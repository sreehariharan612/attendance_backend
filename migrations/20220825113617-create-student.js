'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      rollno: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      batch: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      branch: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [["IT", "CS"]],
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Students');
  }
};