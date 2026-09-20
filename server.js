require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const app = express();

app.use(express.json());
connectDB();
app.use("/auth",authRoutes);
app.use("/students",studentRoutes);
app.get("/",(req, res) =>{
    res.send("Backend is running");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT,() =>{
    console.log(`Server running on port ${PORT}`);
});