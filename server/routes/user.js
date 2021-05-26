const express = require("express");
const router = express.Router();
const bcyrpt = require("bcryptjs");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User");

// init sgMail
sgMail.setApiKey(process.env.sendgrid);

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
			status: { text: "Passwords are not the same", severity: "error" },
		});

	try {
		let user = await User.findOne({ email });
		if (user)
			return res.status(400).json({
				status: {
					text: "User already exists with that email",
					severity: "error",
				},
			});
		user = await User.findOne({ username });
		if (user)
			return res.status(400).json({
				status: {
					text: "User already exists with that username",
					severity: "error",
				},
			});

		const salt = await bcyrpt.genSalt(10);
		if (!salt) throw Error("Error with generating salt");

		const hash = await bcyrpt.hash(password, salt);
		if (!hash) throw Error("Error with generating hash");

		const newUser = new User({
			username,
			email,
			password: hash,
		});
		const savedUser = await newUser.save();
		if (!savedUser) throw Error("Error with saving user");

		const token = await jwt.sign(
			{ id: savedUser.id, username: savedUser.username },
			process.env.jwtSecret
		);

		res.status(200).json({
			token,
			user: savedUser,
			status: {
				text: "Successfully registered!",
				severity: "success",
			},
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

		const token = await jwt.sign(
			{ id: user.id, username: user.username },
			process.env.jwtSecret
		);

		res.status(200).json({
			token,
			user,
			status: { text: "Successfully logged in!", severity: "success" },
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

// @route   POST /api/user/forgot
// @desc    request to change user password
// @acess   Public

router.post("/forgot", async (req, res) => {
	try {
		const token = await crypto.randomBytes(20).toString("hex");
		const user = await User.findOne({ email: req.body.email });
		if (!user) throw Error("No user with that email exists.");
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000;
		await user.save();

		const msg = {
			to: user.email,
			from: "passwordreset@crappit.com",
			subject: "Crappit Password Reset",
			text:
				"You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
				"Please click on the following link, or paste this into your browser to complete the process:\n\n" +
				"https://crappit.herokuapp.com/reset/" +
				token +
				"\n\n" +
				"If you did not request this, please ignore this email and your password will remain unchanged.\n",
		};
		await sgMail.send(msg);
		res.status(200).json({
			status: {
				text: "A message has been sent to your email for further instructions",
				severity: "success",
			},
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   GET /api/user/reset/:token
// @desc    change user password
// @acess   Public

router.get("/reset/:token", async (req, res) => {
	try {
		const user = await User.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user) throw Error("Token is invalid or has expired");
		res.json({
			status: { text: "Token is validated", severity: "success" },
		});
	} catch (err) {
		res.json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   POST /api/user/forgot
// @desc    change user password
// @acess   Public

router.post("/reset/:token", async (req, res) => {
	const { password, password2 } = req.body;
	try {
		if (!password || !password2) throw Error("Please enter a new password");
		if (password !== password2) throw Error("Passwords are not the same");

		const user = await User.findOne({
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user) throw Error("Token is invalid or has expired");

		const salt = await bcyrpt.genSalt(10);
		if (!salt) throw Error("Error with generating salt");

		const hash = await bcyrpt.hash(password, salt);
		if (!hash) throw Error("Error with generating hash");

		user.password = hash;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		const msg = {
			to: user.email,
			from: "passwordreset@crappit.com",
			subject: "Your password has been changed",
			text:
				"Hello,\n\n" +
				"This is a confirmation that the password for your account " +
				user.email +
				" has just been changed.\n",
		};
		await sgMail.send(msg);
		res.status(200).json({
			status: { text: "Your password has been changed", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   GET /api/user/:userid
// @desc    Get user profile
// @access  Public

router.get("/:userid", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.userid });
		if (!user) throw Error("No user found");
		res.status(200).json(user);
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   POST /api/user/email
// @desc    Change user email
// @access  Private

router.post("/email", auth, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id });
		if (!user) throw Error("No user found");
		if (user.email === req.body.newEmail)
			throw Error("You already are using that email");

		const otherUser = await User.findOne({ email: req.body.newEmail });
		if (otherUser) throw Error("A different user has that email");

		const isMatch = await bcyrpt.compare(req.body.password, user.password);
		if (!isMatch)
			return res
				.status(400)
				.json({ status: { text: "Incorrect password", severity: "error" } });
		user.email = req.body.newEmail;
		await user.save();
		res.status(200).json({
			user,
			status: { text: "Your email has been changed", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

module.exports = router;
