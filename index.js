const express = require("express");
const app = express();
const userRoutes = require("./routes/User");
const database = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

database.connect();

app.use(express.json());

// Routes
app.use("/api/v1/auth", userRoutes);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running",
    });
});

app.listen(PORT, () => {
    console.log(`App is running successfully on PORT ${PORT}`);
});

