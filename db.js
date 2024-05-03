const Sequelize = require("sequelize");

// Create a Sequelize instance with connection parameters
const sequelize = new Sequelize("blog", "postgres", "root", {
  host: "localhost",
  dialect: "postgres", // Specify the dialect
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
