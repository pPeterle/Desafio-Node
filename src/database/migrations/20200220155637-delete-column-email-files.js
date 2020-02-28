module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('files', 'email');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('files', 'email', {
      type: Sequelize.STRING,
    });
  },
};
