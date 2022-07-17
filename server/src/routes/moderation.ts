import express from 'express';
import { isModerator } from '../middleware/isModerator';
import { deleteFile, upload } from '../middleware/upload';
import { auth } from '../middleware/auth';
import {
  User, Post, Comment,
} from '../entities';

const router = express.Router();

// @route   POST /api/moderation/:topic/user
// @desc    Add a moderator to a topic
// @access  Private

router.post('/:topic/user', auth, isModerator, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }, { relations: ['topics_moderated'] });
    if (!user) throw Error('User does not exist');

    user.topics_moderated.push(req.topic);
    await user.save();
    res.status(200).json({
      user: { user_id: user.id, username: user.username, topic_id: req.topic.id },
      status: { text: 'Moderator successfully added', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/moderation/:topic/user/:userid
// @desc    Delete a moderator of a topic
// @access  Private

router.delete('/:topic/user/:userid', auth, isModerator, async (req, res) => {
  try {
    const user = await User.findOne(req.params.userid, { relations: ['topics_moderated'] });
    if (!user) throw Error('User does not exist');

    user.topics_moderated = user.topics_moderated
      .filter((curTopic) => curTopic.id !== req.topic.id);

    await user.save();
    res.status(200).json({
      user: { user_id: user.id, username: user.username, topic_id: req.topic.id },
      status: { text: 'Moderator successfully removed', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   DELETE /api/moderation/:topic/post/:post
// @desc    Delete a post
// @access  Private

router.delete('/:topic/post/:post', auth, isModerator, async (req, res) => {
  try {
    const post = await Post.findOne(req.params.post);
    if (!post) throw Error('Post does not exist');

    await Post.remove(post);
    if (post.type === 'photo') deleteFile(post.image_name);
    res.status(200).json({
      status: { text: 'Post successfully deleted', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   DELETE /api/moderation/:topic/comment/:commentid
// @desc    Delete a comment
// @access  Private

router.delete('/:topic/comment/:commentid', auth, isModerator, async (req, res) => {
  try {
    const comment = await Comment.findOne(req.params.commentid);
    if (!comment) throw Error('Comment does not exist');

    comment.content = null;
    comment.author = null;
    comment.is_deleted = true;

    await comment.save();

    res.status(200).json({
      comment,
      status: { text: 'Comment succesfully deleted', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/moderation/:topic/add_rule
// @desc    Add rule
// @access  Private

router.post('/:topic/add_rule', auth, isModerator, async (req, res) => {
  try {
    if (req.topic.rules.length === 15) throw Error('You can have at most 15 rules');
    if (req.body.rule.name.length > 100) throw Error('Rule name is too long');
    if (req.body.rule.description.length > 500) throw Error('Rule description is too long');

    req.topic.rules.push(req.body.rule);

    await req.topic.save();

    res.status(200).json({
      rule: req.body.rule,
      status: { text: 'Successfully added rule', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/moderation/:topic/delete_rule
// @desc    Delete rule
// @access  Private

router.post('/:topic/delete_rule', auth, isModerator, async (req, res) => {
  try {
    req.topic.rules = req.topic.rules.filter(
      (rule: any) => rule.created_at !== req.body.rule.created_at,
    );

    await req.topic.save();

    res.status(200).json({
      rule: req.body.rule,
      status: { text: 'Successfully deleted rule', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/moderation/:topic/icon
// @desc    Change topic icon
// @access  Private

router.post('/:topic/icon', auth, isModerator, upload, async (req, res) => {
  try {
    if (req.topic.icon_image_name && req.file) {
      // if topic already has banner and a photo has been uploaded
      deleteFile(req.topic.icon_image_name);
      req.topic.icon_image_url = req.file.location;
      req.topic.icon_image_name = req.file.key;
    } else if (req.file) {
      // if topic doesnt have a banner and a photo has been uploaded
      req.topic.icon_image_url = req.file.location;
      req.topic.icon_image_name = req.file.key;
    }

    await req.topic.save();

    res.status(200).json({
      topic: {
        icon_image_url: req.topic.icon_image_url,
        icon_image_name: req.topic.icon_image_name,
      },
      status: { text: 'Successfully updated icon', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/moderation/:topic/banner
// @desc    Change topic banner
// @access  Private

router.post('/:topic/banner', auth, isModerator, upload, async (req, res) => {
  try {
    if (req.topic.image_name && req.file) {
      // if topic already has banner and a photo has been uploaded
      deleteFile(req.topic.image_name);
      req.topic.image_url = req.file.location;
      req.topic.image_name = req.file.key;
    } else if (req.file) {
      // if topic doesnt have a banner and a photo has been uploaded
      req.topic.image_url = req.file.location;
      req.topic.image_name = req.file.key;
    }

    await req.topic.save();

    res.status(200).json({
      topic: { image_url: req.topic.image_url, image_name: req.topic.image_name },
      status: { text: 'Successfully updated banner', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   PUT /api/moderation/:topic
// @desc    Update a topic
// @access  Private

router.put('/:topic', auth, isModerator, async (req, res) => {
  try {
    if (req.body.description.length > 500) throw Error('Topic description is too long');
    if (req.body.headline.length > 100) throw Error('Topic headline is too long');

    req.topic.description = req.body.description;
    req.topic.headline = req.body.headline;

    await req.topic.save();

    res.status(200).json({
      topic: { description: req.topic.description, headline: req.topic.headline },
      status: { text: 'Successfully updated topic', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

export const ModerationRouter = router;
