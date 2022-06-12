import express from 'express';
import bcyrpt from 'bcryptjs';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import { MoreThan } from 'typeorm';
import { auth, optionalAuth } from '../middleware/auth';
import { Post, Topic, User } from '../entities';
import { deleteFile, upload } from '../middleware/upload';
import passport from '../middleware/passport';
import redis from '../common/redis';

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
  req.session.user = req.user;
  redis.sadd(`user_sess:${req.user.id}`, `sess:${req.session.id}`);
  res.redirect(process.env.CLIENT_URL);
});

// @route   GET /api/user/me
// @desc    Get user
// @access  Public

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findOne(req.user.id);

    const { password, ...rest } = user;

    res
      .status(200)
      .json({ user: { ...rest } });
  } catch (err) {
    req.session.destroy((session_err: any) => {
      if (session_err) throw Error('Something went wrong');
    });
    res
      .status(403)
      .clearCookie('crappit_session', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.DOMAIN,
      })
      .json({ user: null });
  }
});

// @route   POST /api/user/register
// @desc    Register user
// @acess   Public

router.post('/register', async (req, res) => {
  try {
    const {
      username, email, password, password2,
    } = req.body;
    if (!username || !email || !password || !password2) throw Error('Missing field');
    if (password !== password2) throw Error('Passwords are not the same');
    if (username.length > 20 || username.length < 3) throw Error('Username is too short or too long');
    if (password.length < 6) throw Error('Password is too short');

    const salt = await bcyrpt.genSalt(10);
    if (!salt) throw Error('Error with generating salt');

    const hash = await bcyrpt.hash(password, salt);
    if (!hash) throw Error('Error with generating hash');

    const newUser = await User.create({
      username,
      email,
      password: hash,
    }).save().catch(() => { throw Error('A user already exists with that username or email'); });

    req.session.user = { id: newUser.id };
    redis.sadd(`user_sess:${newUser.id}`, `sess:${req.session.id}`);

    res.status(200).json({
      user: { ...newUser },
      status: {
        text: 'Successfully registered!',
        severity: 'success',
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/user/login
// @desc    Login user
// @acess   Public

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw Error('Missing fields');
    if (username.length > 20 || username.length < 3) throw Error('Username is too short or too long');

    const user = await User.findOne({ username });
    if (!user) throw Error('User does not exist');

    const isMatch = await bcyrpt.compare(password, user.password).catch(() => { throw new Error('Invalid email or password'); });
    if (!isMatch) throw Error('Invalid email or password');

    req.session.user = { id: user.id };
    redis.sadd(`user_sess:${user.id}`, `sess:${req.session.id}`);

    res.status(200)
      .json({
        user: { ...user },
        status: { text: 'Successfully logged in!', severity: 'success' },
      });
  } catch (err) {
    res
      .status(400)
      .json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/user/forgot
// @desc    request to change user password
// @acess   Public

router.post('/forgot', async (req, res) => {
  try {
    const token = crypto.randomBytes(20).toString('hex');
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw Error('No user with that email exists.');

    user.reset_password_token = token;
    user.reset_password_expires = Date.now() + 3600000;

    await user.save();

    const msg = {
      to: user.email,
      from: 'Crappit <noreply@crappit.com>',
      subject: '[crappit] password reset request',
      text:
        `You or someone else has requested a password change for /u/${user.username}.\n\n`
        + 'Please click on the following link, or paste this into your browser to complete the process:\n'
        + `${process.env.CLIENT_URL}/reset?token=${token}\n\n`
        + 'If you did not request this, please ignore this email and your password will remain unchanged.\n\n'
        + 'This inbox is not monitored and responses will not be seen.',
    };
    await sgMail.send(msg);
    res.status(200).json({
      status: {
        text: 'A message has been sent to your email for further instructions',
        severity: 'success',
      },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   GET /api/user/reset/:token
// @desc    change user password
// @acess   Public

router.get('/reset/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      reset_password_token: req.params.token,
      reset_password_expires: MoreThan(Date.now()),
    });
    if (!user) throw Error('Token is invalid or has expired');
    res.status(200).json({
      status: { text: 'Token is validated', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/user/forgot
// @desc    change user password
// @acess   Public

router.post('/reset/:token', async (req, res) => {
  const { password, password2 } = req.body;
  try {
    if (!password || !password2) throw Error('Please enter a new password');
    if (password !== password2) throw Error('Passwords are not the same');
    if (password.length < 6) throw Error('Password is too short');

    const user = await User.findOne({
      reset_password_token: req.params.token,
      reset_password_expires: MoreThan(Date.now()),
    });
    if (!user) throw Error('Token is invalid or has expired');

    const salt = await bcyrpt.genSalt(10);
    if (!salt) throw Error('Error with generating salt');

    const hash = await bcyrpt.hash(password, salt);
    if (!hash) throw Error('Error with generating hash');

    user.password = hash;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    const msg = {
      to: user.email,
      from: 'Crappit <noreply@crappit.com>',
      subject: '[crappit] your password has been changed',
      text:
        `The password for /u/${user.username} has been changed. `
        + 'If you did not make this change, please immediately update your password by clicking here:\n'
        + `${process.env.CLIENT_URL}/forgot\n\n`
        + 'This inbox is not monitored and responses will not be seen.',
    };
    await sgMail.send(msg);

    const user_sessions = await redis.smembers(`user_sess:${user.id}`);
    await redis.del(`user_sess:${user.id}`);
    await redis.del(user_sessions);

    req.session.destroy((err: any) => {
      if (err) throw Error('Something went wrong');
    });

    res.status(200)
      .clearCookie('crappit_session', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.DOMAIN,
      })
      .json({
        status: { text: 'Your password has been changed. Please login again.', severity: 'success' },
      });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   GET /api/user/:userid
// @desc    Get user profile
// @access  Public

router.get('/:userid', async (req, res) => {
  try {
    const user = await User.findOne(req.params.userid);
    if (!user) throw Error('No user found');

    const topics_moderated = await Topic.query(`
      select
      t.title title,
      t.icon_image_url icon_image_url,
      t.icon_image_name icon_image_name,
      t.number_of_followers number_of_followers
      from moderator m
      left join topic t on m.topic_id = t.id
      where m.user_id = $1
  `, [req.params.userid]);

    const { password, ...rest } = user;

    res.status(200).json({ user: { ...rest, topics_moderated } });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/user/email
// @desc    Change user email
// @access  Private

router.post('/email', auth, async (req, res) => {
  try {
    const user = await User.findOne(req.user.id);
    if (!user) throw Error('No user found');
    if (user.email === req.body.newEmail) throw Error('You already are using that email');

    const isMatch = await bcyrpt.compare(req.body.password, user.password);
    if (!isMatch) throw Error('Incorrect password');

    user.email = req.body.newEmail;
    await user.save().catch(() => { throw Error('A user already exists with that email'); });

    const msg = {
      to: user.email,
      from: 'Crappit <noreply@crappit.com>',
      subject: '[crappit] your email address has been changed',
      text:
        `The e-mail address for /u/${user.username}} has been changed to ${user.email}.\n`
        + 'If you did not request this, please contact us.\n'
        + 'This message is being sent to your old e-mail address only.',
    };
    await sgMail.send(msg);

    res.status(200).json({
      user: { email: user.email },
      status: { text: 'Your email has been changed', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/user/:userid/avatar
// @desc    Change user email
// @access  Private

router.post('/:userid/avatar', auth, upload, async (req, res) => {
  try {
    const user = await User.findOne(req.user.id);
    if (!user) throw Error('No user found');

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
      status: { text: 'Successfully updated avatar', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/user/logout
// @desc    Logout user
// @access  Public

router.post('/logout', auth, async (req, res) => {
  try {
    await redis.srem(`user_sess:${req.user.id}`, `sess:${req.session.id}`);
    req.session.destroy((err: any) => {
      if (err) throw Error('Something went wrong');
    });
    res
      .clearCookie('crappit_session', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.DOMAIN,
      })
      .json({ status: { text: 'Successfully logged out', severity: 'success' } });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
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

    res.status(200).json({
      posts,
      nextCursor: posts.length
        ? parseInt(req.query.skip as string) + posts.length
        : undefined,
    });
  } catch (err) {
    res.status(400).json({
      status: { text: 'Could not fetch posts', severity: 'error' },
    });
  }
});

export const UserRouter = router;
