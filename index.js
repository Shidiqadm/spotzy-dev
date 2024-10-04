const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const parkManagerRoutes = require("./routes/parkManagerRoutes");

require("dotenv").config(); // Import dotenv for environment variables

app.use(
  cors()
);

app.use(express.json()); // Middleware to parse request body as JSON

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/manage", parkManagerRoutes);

// Sequelize Authentication and Sync
(async () => {
  try {
    // Authenticate the connection
    await sequelize.authenticate();
    console.log("Connection to PostgreSQL has been established successfully.");

    // Synchronize the models with the database
    await sequelize.sync({ force: false, schema: "public" });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Basic route
app.get("/", (req, res) => {
  res.send("Spotzy backend is running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});