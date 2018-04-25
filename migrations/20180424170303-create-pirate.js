"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Pirates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      family_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rank: {
        allowNull: false,
        type: Sequelize.STRING
      },
      beard: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      nick_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      birth_country: {
        allowNull: false,
        type: Sequelize.STRING
      },
      date_of_birth: {
        allowNull: false,
        type: Sequelize.DATE
      },
      worth: {
        allowNull: false,
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Pirates");
  }
};
