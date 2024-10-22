const express = require("express");
const cors = require("cors");
const sequelize = require("./sequelize"); // Import Sequelize connection
const appModules = ["products", "categories"];

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error synchronizing the database:", error);
  });

// Routes
appModules.forEach((item) => {
  app.use(`/api/${item}`, require(`./routes/${item}`));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
