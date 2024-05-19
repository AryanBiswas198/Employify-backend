const express = require("express");
const app = express();
const userRoutes = require("./routes/User");
const jobRoutes = require("./routes/Job");
const profileRoutes = require("./routes/Profile");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

database.connect();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/profile", profileRoutes);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running",
    });
});

app.listen(PORT, () => {
    console.log(`App is running successfully on PORT ${PORT}`);
});

