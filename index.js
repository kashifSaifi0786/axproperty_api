const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const teamRouter = require("./routes/team");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/team", teamRouter);

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
