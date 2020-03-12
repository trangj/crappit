const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const keys = require("./config/keys");

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect db
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  () => console.log("MongoDB connected...")
);

// init cors for client
app.use(cors());

// routes
app.use("/", require("./routes/index"));
app.use("/user", require("./routes/user"));

app.listen(5000, () => console.log("Server started on port 5000..."));
