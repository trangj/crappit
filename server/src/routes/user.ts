import express from "express";
import bcyrpt from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import jwt, { verify } from "jsonwebtoken";
import { auth } from "../middleware/auth";
import { Topic, User } from "../entities";
import { MoreThan } from 'typeorm';

const router = express.Router();

// init sgMail
sgMail.setApiKey(process.env.sendgrid);

// @route   POST /api/user/register
// @desc    Register user
// @acess   Public

router.post("/register", async (req, res) => {
	try {
		const { username, email, password, password2 } = req.body;
		if (!username || !email || !password || !password2) throw Error("Missing field");
		if (password !== password2) throw Error("Passwords are not the same");

		const salt = await bcyrpt.genSalt(10);
		if (!salt) throw Error("Error with generating salt");

		const hash = await bcyrpt.hash(password, salt);
		if (!hash) throw Error("Error with generating hash");

		const newUser = await User.create({
			username,
			email,
			password: hash,
		}).save().catch(err => { throw Error("A user already exists with that username or email"); });

		const refresh_token = jwt.sign(
			{ id: newUser.id, username: newUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '7d' }
		);

		const access_token = jwt.sign(
			{ id: newUser.id, username: newUser.username },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);

		res.status(200).cookie('token', refresh_token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }).json({
			access_token,
			user: { ...newUser, topics_followed: [] },
			status: {
				text: "Successfully registered!",
				severity: "success",
			},
		});
	} catch (err) {
		res
			.status(400)
			.json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   GET /api/user/login
// @desc    Login user
// @acess   Public

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) throw Error("Missing fields");

		const user = await User.findOne({ email });
		if (!user) throw Error("User does not exist");

		const topics_followed = await Topic.query(`
			select
			t.title title
			from follow ft
			left join topic t on ft.topic_id = t.id
			where ft.user_id = $1
		`, [user.id]);

		const isMatch = await bcyrpt.compare(password, user.password);
		if (!isMatch) throw Error("Invalid password");

		const refresh_token = jwt.sign(
			{ id: user.id, username: user.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '7d' }
		);

		const access_token = jwt.sign(
			{ id: user.id, username: user.username },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);

		res.status(200).cookie('token', refresh_token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }).json({
			access_token,
			user: { ...user, topics_followed },
			status: { text: "Successfully logged in!", severity: "success" },
		});
	} catch (err) {
		res
			.status(400)
			.json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   POST /api/user/forgot
// @desc    request to change user password
// @acess   Public

router.post("/forgot", async (req, res) => {
	try {
		const token = crypto.randomBytes(20).toString("hex");
		const user = await User.findOne({ email: req.body.email });
		if (!user) throw Error("No user with that email exists.");

		user.reset_password_token = token;
		user.reset_password_expires = Date.now() + 3600000;

		await user.save();

		const msg = {
			to: user.email,
			from: "passwordreset@crappit.com",
			subject: "Crappit Password Reset",
			text:
				"You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
				"Please click on the following link, or paste this into your browser to complete the process:\n\n" +
				"https://crappit.netlify.com/reset/" +
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
			reset_password_token: req.params.token,
			reset_password_expires: MoreThan(Date.now())
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
			reset_password_token: req.params.token,
			reset_password_expires: MoreThan(Date.now())
		});
		if (!user) throw Error("Token is invalid or has expired");

		const salt = await bcyrpt.genSalt(10);
		if (!salt) throw Error("Error with generating salt");

		const hash = await bcyrpt.hash(password, salt);
		if (!hash) throw Error("Error with generating hash");

		user.password = hash;
		user.reset_password_token = null;
		user.reset_password_expires = null;
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
		const user = await User.findOne(req.params.userid);
		if (!user) throw Error("No user found");

		const topics_followed = await Topic.query(`
			select
			t.title title
			from follow ft
			left join topic t on ft.topic_id = t.id
			where ft.user_id = $1
		`, [req.params.userid]);

		const { password, ...rest } = user;

		res.status(200).json({ user: { ...rest, topics_followed } });
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
		const user = await User.findOne(req.user.id);
		if (!user) throw Error("No user found");
		if (user.email === req.body.newEmail)
			throw Error("You already are using that email");

		const isMatch = await bcyrpt.compare(req.body.password, user.password);
		if (!isMatch) throw Error("Incorrect password");

		user.email = req.body.newEmail;
		await user.save().catch(err => { throw Error("A user already exists with that email"); });

		res.status(200).json({
			user: { email: user.email },
			status: { text: "Your email has been changed", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// Get new access token and refresh token

router.post("/refresh_token", async (req, res) => {
	try {
		const refresh_token = req.cookies.token;
		if (!refresh_token) throw Error;


		let payload = null;
		payload = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
		if (!payload) throw Error;

		const user = await User.findOne(refresh_token.id);
		if (!user) throw Error("No user found");

		const topics_followed = await Topic.query(`
			select
			t.title title
			from follow ft
			left join topic t on ft.topic_id = t.id
			where ft.user_id = $1
		`, [user.id]);

		const { password, ...rest } = user;

		const new_refresh_token = jwt.sign(
			{ id: user.id },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '7d' }
		);

		const new_access_token = jwt.sign(
			{ id: user.id, username: user.username },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);

		res.status(200)
			.cookie("token", new_refresh_token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
			.json({ access_token: new_access_token, user: { ...rest, topics_followed } });
	} catch (err) {
		res.status(403).json({ access_token: "" });
	}
});

// Logout
router.post('/logout', async (req, res) => {
	try {
		res.clearCookie('token').json({ access_token: '' });
	} catch (err) {
		//
	}
});

export const UserRouter = router;
