const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  followedTopics: [String],
  register_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("User", userSchema);
