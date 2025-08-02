const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "sqlite",
    storage: "./database.sqlite",
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Error: " + err));

module.exports = sequelize;
