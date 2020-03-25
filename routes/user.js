const express = require("express");
const router = express.Router();
const bcyrpt = require("bcryptjs");
const keys = require("../config/keys");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET /api/user/register
// @desc    Register user
// @acess   Public

router.post("/register", async (req, res) => {
  const { username, email, password, password2 } = req.body;
  if (!username || !email || !password || !password2)
    return res
      .status(400)
      .json({ status: { text: "Missing fields", severity: "error" } });

  if (password !== password2)
    return res.status(400).json({
      status: { text: "Passwords are not the same", severity: "error" }
    });

  try {
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ status: { text: "User already exists", severity: "error" } });

    const salt = await bcyrpt.genSalt(10);
    if (!salt) throw Error("Error with generating salt");

    const hash = await bcyrpt.hash(password, salt);
    if (!hash) throw Error("Error with generating hash");

    const newUser = new User({
      username,
      email,
      password: hash
    });
    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Error with saving user");

    const token = await jwt.sign({ id: savedUser.id }, keys.jwtSecret, {
      expiresIn: 3600
    });
    res.status(200).json({
      token,
      user: savedUser,
      status: {
        text: "Successfully registered, you can now login!",
        severity: "success"
      }
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: { text: "Error in creating user", severity: "error" } });
  }
});

// @route   GET /api/user/login
// @desc    Login user
// @acess   Public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    res
      .status(400)
      .json({ status: { text: "Missing fields", severity: "error" } });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: { text: "User does not exist", severity: "error" } });

    const isMatch = await bcyrpt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: { text: "Invalid credentials", severity: "error" } });

    const token = await jwt.sign({ id: user.id }, keys.jwtSecret, {
      expiresIn: 3600
    });

    res.status(200).json({
      token,
      user,
      status: { text: "Successfully logged in!", severity: "success" }
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: { text: "Could not login", severity: "error" } });
  }
});

// @route   GET /api/user
// @desc    Get user
// @acess   Private

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) throw Error("No user");
    res.status(200).json({ user });
  } catch (err) {
    res
      .status(400)
      .json({ status: { text: "Could not get user", severity: "error" } });
  }
});

module.exports = router;
