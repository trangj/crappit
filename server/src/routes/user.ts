import express from "express";
import bcyrpt from "bcryptjs";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import jwt, { verify } from "jsonwebtoken";
import { auth, optionalAuth } from "../middleware/auth";
import { Post, User } from "../entities";
import { MoreThan } from 'typeorm';
import { deleteFile, upload } from "../middleware/upload";
import passport from '../middleware/passport';

const router = express.Router();

// init sgMail
sgMail.setApiKey(process.env.SENDGRID_KEY);

// @route   GET /api/user/google
// @desc    Redirect user to google sign in
// @acess   Public

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account', session: false }));

// @route   POST /api/user/google/callback
// @desc    Redirect user to client after google sign in
// @acess   Public

router.get('/google/callback', passport.authenticate('google', { failureRedirect: process.env.CLIENT_URL, session: false }), async (req, res) => {
	res
		.cookie('token', req.user, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
			secure: process.env.NODE_ENV === 'production',
			domain: process.env.DOMAIN
		})
		.redirect(process.env.CLIENT_URL);
});

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
			{ id: newUser.id, token_version: newUser.token_version },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '7d' }
		);

		const access_token = jwt.sign(
			{ id: newUser.id },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);

		res.status(200)
			.cookie('token', refresh_token, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
				secure: process.env.NODE_ENV === 'production',
				domain: process.env.DOMAIN
			})
			.json({
				access_token,
				user: { ...newUser, karma: 0 },
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

// @route   POST /api/user/login
// @desc    Login user
// @acess   Public

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) throw Error("Missing fields");

		const user = await User.findOne({ email });
		if (!user) throw Error("User does not exist");

		const isMatch = await bcyrpt.compare(password, user.password).catch((err) => { throw new Error('Invalid email or password'); });
		if (!isMatch) throw Error("Invalid email or password");

		const karma = await Post.query(`
			select ((select sum(vote) from post where post.author_id = $1) + (select sum(vote) from comment where comment.author_id = $1)) as karma
		`, [user.id]);

		const refresh_token = jwt.sign(
			{ id: user.id, token_version: user.token_version },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '7d' }
		);

		const access_token = jwt.sign(
			{ id: user.id },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);

		res.status(200)
			.cookie('token', refresh_token, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
				secure: process.env.NODE_ENV === 'production',
				domain: process.env.DOMAIN
			})
			.json({
				access_token,
				user: { ...user, karma: karma[0].karma },
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
			from: "Crappit <noreply@crappit.com>",
			subject: "[crappit] password reset request",
			text:
				`You or someone else has requested a password change for /u/${user.username}.\n\n` +
				"Please click on the following link, or paste this into your browser to complete the process:\n" +
				`${process.env.CLIENT_URL}/reset?token=${token}\n\n` +
				"If you did not request this, please ignore this email and your password will remain unchanged.\n\n" +
				"This inbox is not monitored and responses will not be seen.",
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
		res.status(200).json({
			status: { text: "Token is validated", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
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
		user.token_version += 1;
		await user.save();

		const msg = {
			to: user.email,
			from: "Crappit <noreply@crappit.com>",
			subject: "[crappit] your password has been changed",
			text:
				`The password for /u/${user.username} has been changed. ` +
				"If you did not make this change, please immediately update your password by clicking here:\n" +
				`${process.env.CLIENT_URL}/forgot\n\n` +
				"This inbox is not monitored and responses will not be seen.",
		};
		await sgMail.send(msg);
		res.status(200)
			.clearCookie('token', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				domain: process.env.DOMAIN
			})
			.json({
				status: { text: "Your password has been changed. Please login again.", severity: "success" },
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

		const karma = await User.query(`
			select ((select coalesce(sum(vote), 0) from post where post.author_id = $1) + (select coalesce(sum(vote), 0) from comment where comment.author_id = $1)) as karma
		`, [req.params.userid]);

		const { password, ...rest } = user;

		res.status(200).json({ user: { ...rest, karma: karma[0].karma } });
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

		const msg = {
			to: user.email,
			from: "Crappit <noreply@crappit.com>",
			subject: "[crappit] your email address has been changed",
			text:
				`The e-mail address for /u/${user.username}} has been changed to ${user.email}.\n` +
				"If you did not request this, please contact us.\n" +
				"This message is being sent to your old e-mail address only.",
		};
		await sgMail.send(msg);

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

// @route   POST /api/user/:userid/avatar
// @desc    Change user email
// @access  Private

router.post('/:userid/avatar', auth, upload, async (req, res) => {
	try {
		const user = await User.findOne(req.user.id);
		if (!user) throw Error("No user found");

		if (user.avatar_image_name && req.file) {
			// if user already has an avatar and a photo has been uploaded
			deleteFile(user.avatar_image_name);
			user.avatar_image_url = req.file.location;
			user.avatar_image_name = req.file.key;
		} else if (req.file) {
			// if topic doesnt has an avatar and a photo has been uploaded
			user.avatar_image_url = req.file.location;
			user.avatar_image_name = req.file.key;
		}

		await user.save();

		res.status(200).json({
			user: { avatar_image_url: user.avatar_image_url, avatar_image_name: user.avatar_image_name },
			status: { text: "Successfully updated avatar", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   POST /api/user/refresh_token
// @desc    Get new refresh/access token
// @access  Public

router.post("/refresh_token", async (req, res) => {
	try {
		const refresh_token = req.cookies.token;
		if (!refresh_token) throw Error;

		let payload = null;
		payload = verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
		if (!payload) throw Error;

		const user = await User.findOne((payload as any).id);
		if (!user) throw Error;
		if (user.token_version !== (payload as any).token_version) throw Error;

		const karma = await User.query(`
			select ((select coalesce(sum(vote), 0) from post where post.author_id = $1) + (select coalesce(sum(vote), 0) from comment where comment.author_id = $1)) as karma
		`, [user.id]);

		const { password, ...rest } = user;

		const new_refresh_token = jwt.sign(
			{ id: user.id, token_version: user.token_version },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '7d' }
		);

		const new_access_token = jwt.sign(
			{ id: user.id },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '15m' }
		);

		res.status(200)
			.cookie("token", new_refresh_token, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 7,
				secure: process.env.NODE_ENV === 'production',
				domain: process.env.DOMAIN
			})
			.json({ access_token: new_access_token, user: { ...rest, karma: karma[0].karma } });
	} catch (err) {
		res.status(401).json({ status: { text: "Refresh token expired", severity: "error" } });;
	}
});

// @route   POST /api/user/logout
// @desc    Logout user
// @access  Public

router.post('/logout', async (req, res) => {
	res
		.clearCookie('token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			domain: process.env.DOMAIN
		})
		.json({ access_token: '' });
});

// @route   POST /api/user/:userid/posts
// @desc    Get a users posts
// @access  Public

router.get('/:userid/posts', optionalAuth, async (req, res) => {
	try {
		const posts = await Post.query(`
			select
			p.*,
			t.title topic,
			u.username author,
			v.value user_vote
			from post p
			inner join topic t on p.topic_id = t.id
			inner join "user" u on p.author_id = u.id
			left join vote v on p.id = v.post_id and v.user_id = $1
			where p.author_id = $2
			order by
				(case when $3 = 'top' then p.vote end) desc,
				(case when $3 = 'new' then p.created_at end) desc,
				(case when $3 = 'hot' or $3 = '' then p.number_of_comments end) desc
			limit 10 offset $4
		`, [req.user.id, req.params.userid, req.query.sort, req.query.skip]);
		if (!posts) throw Error("No posts found");
		res.status(200).json({
			posts,
			nextCursor: posts.length
				? parseInt(req.query.skip as string) + posts.length
				: undefined,
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

export const UserRouter = router;
