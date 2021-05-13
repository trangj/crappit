const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect db
mongoose.connect(
	process.env.mongoURI,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
	() => console.log("MongoDB connected...")
);

// init cors for client
app.use(cors());

// routes
app.use("/api/index", require("./routes/comment"));
app.use("/api/index", require("./routes/post"));
app.use("/api/index", require("./routes/topic"));
app.use("/api/user", require("./routes/user"));

app.listen(process.env.PORT || 5000, () =>
	console.log("Server started on port 5000...")
);
