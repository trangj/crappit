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
  likes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  disikes: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  register_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("User", userSchema);
