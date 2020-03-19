const express = require("express");
const router = express.Router();
const bcyrpt = require("bcryptjs");
const keys = require("../config/keys");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    res.status(400).json({ status: "Missing fields" });

  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ status: "User already exists" });
    const newUser = new User({
      username,
      email,
      password
    });
    bcyrpt.genSalt(10, (err, salt) => {
      bcyrpt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user =>
          jwt.sign(
            { id: user.id },
            keys.jwtSecret,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  username: user.username,
                  email: user.email
                }
              });
            }
          )
        );
      });
    });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) res.status(400).json({ status: "Missing fields" });

  User.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ status: "User does not exist" });

    bcyrpt.compare(password, user.password).then(isMatch => {
      if (!isMatch)
        return res.status(400).json({ status: "Invalid credentials" });
      jwt.sign(
        { id: user.id },
        keys.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email
            }
          });
        }
      );
    });
  });
});

router.get("/getuser", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json({ user }));
});

module.exports = router;
