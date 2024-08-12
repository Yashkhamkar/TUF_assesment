const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bannerRoutes = require("./Routes/Banner.routes");
const userRoutes = require("./Routes/User.routes");
const path = require("path");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", bannerRoutes);
app.use("/user", userRoutes);
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
