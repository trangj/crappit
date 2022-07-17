import express from 'express';
import { deleteFile, upload } from '../middleware/upload';
import { auth } from '../middleware/auth';
import {
  User, Topic, Post, Comment,
} from '../entities';

const router = express.Router();

// @route   POST /api/moderation/topic/:topic
// @desc    Add a moderator to a topic
// @access  Private

router.post('/topic/:topic', auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }, { relations: ['topics_moderated'] });
    if (!user) throw Error('User does not exist');
    const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
    if (!topic) throw Error('Topic does not exist');
    if (!topic.moderators.some((moderator) => moderator.id === req.user.id)) throw Error('You are not a moderator');

    user.topics_moderated.push(topic);
    await user.save();
    res.status(200).json({
      user: { user_id: user.id, username: user.username, topic_id: topic.id },
      status: { text: 'Moderator successfully added', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/moderation/topic/:topic/:userid
// @desc    Delete a moderator of a topic
// @access  Private

router.delete('/topic/:topic/:userid', auth, async (req, res) => {
  try {
    const user = await User.findOne(req.params.userid, { relations: ['topics_moderated'] });
    if (!user) throw Error('User does not exist');
    const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
    if (!topic) throw Error('Topic does not exist');
    if (!topic.moderators.some((moderator) => moderator.id === req.user.id)) throw Error('You are not a moderator');

    user.topics_moderated = user.topics_moderated.filter((curTopic) => curTopic.id !== topic.id);

    await user.save();
    res.status(200).json({
      user: { user_id: user.id, username: user.username, topic_id: topic.id },
      status: { text: 'Moderator successfully removed', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   DELETE /api/moderation/post/:post
// @desc    Delete a post
// @access  Private

router.delete('/post/:post', auth, async (req, res) => {
  try {
    const post = await Post.findOne(req.params.post, { relations: ['topic'] });
    if (!post) throw Error('Post does not exist');
    const topic = await Topic.findOne({ title: post.topic.title }, { relations: ['moderators'] });
    if (!topic) throw Error('Topic does not exist');
    if (!topic.moderators.some((moderator) => moderator.id === req.user.id)) throw Error('You are not a moderator');
    await Post.remove(post);
    if (post.type === 'photo') deleteFile(post.image_name);
    res.status(200).json({
      status: { text: 'Post successfully deleted', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   DELETE /api/moderation/comment/:commentid
// @desc    Delete a comment
// @access  Private

router.delete('/comment/:commentid', auth, async (req, res) => {
  try {
    const comment = await Comment.findOne(req.params.commentid, { relations: ['post', 'post.topic'] });
    if (!comment) throw Error('Comment does not exist');
    const topic = await Topic.findOne({ title: comment.post.topic.title }, { relations: ['moderators'] });
    if (!topic) throw Error('Topic does not exist');
    if (!topic.moderators.some((moderator) => moderator.id === req.user.id)) throw Error('You are not a moderator');

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

router.post('/:topic/add_rule', auth, async (req, res) => {
  try {
    const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
    if (!topic) throw Error('Could not update topic');

    const user = await User.findOne(req.user.id);
    if (!topic.moderators.some((moderator) => moderator.id === user.id)) throw Error('You are not a moderator');

    if (topic.rules.length === 15) throw Error('You can have at most 15 rules');
    if (req.body.rule.name.length > 100) throw Error('Rule name is too long');
    if (req.body.rule.description.length > 500) throw Error('Rule description is too long');

    topic.rules.push(req.body.rule);

    await topic.save();

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

router.post('/:topic/delete_rule', auth, async (req, res) => {
  try {
    const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
    if (!topic) throw Error('Could not update topic');

    const user = await User.findOne(req.user.id);
    if (!topic.moderators.some((moderator) => moderator.id === user.id)) throw Error('You are not a moderator');

    topic.rules = topic.rules.filter(
      (rule) => rule.created_at !== req.body.rule.created_at,
    );

    await topic.save();

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

router.post('/:topic/icon', auth, upload, async (req, res) => {
  try {
    const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
    if (!topic) throw Error('Could not update topic');

    const user = await User.findOne(req.user.id);
    if (!topic.moderators.some((moderator) => moderator.id === user.id)) throw Error('You are not a moderator');

    if (topic.icon_image_name && req.file) {
      // if topic already has banner and a photo has been uploaded
      deleteFile(topic.icon_image_name);
      topic.icon_image_url = req.file.location;
      topic.icon_image_name = req.file.key;
    } else if (req.file) {
      // if topic doesnt have a banner and a photo has been uploaded
      topic.icon_image_url = req.file.location;
      topic.icon_image_name = req.file.key;
    }

    await topic.save();

    res.status(200).json({
      topic: { icon_image_url: topic.icon_image_url, icon_image_name: topic.icon_image_name },
      status: { text: 'Successfully updated icon', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   POST /api/moderation/:topic/banner
// @desc    Change topic banner
// @access  Private

router.post('/:topic/banner', auth, upload, async (req, res) => {
  try {
    const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
    if (!topic) throw Error('Could not update topic');

    const user = await User.findOne(req.user.id);
    if (!topic.moderators.some((moderator) => moderator.id === user.id)) throw Error('You are not a moderator');

    if (topic.image_name && req.file) {
      // if topic already has banner and a photo has been uploaded
      deleteFile(topic.image_name);
      topic.image_url = req.file.location;
      topic.image_name = req.file.key;
    } else if (req.file) {
      // if topic doesnt have a banner and a photo has been uploaded
      topic.image_url = req.file.location;
      topic.image_name = req.file.key;
    }

    await topic.save();

    res.status(200).json({
      topic: { image_url: topic.image_url, image_name: topic.image_name },
      status: { text: 'Successfully updated banner', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   PUT /api/moderation/:topic
// @desc    Update a topic
// @access  Private

router.put('/:topic', auth, async (req, res) => {
  try {
    const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
    if (!topic) throw Error('Could not update topic');

    const user = await User.findOne(req.user.id);
    if (!topic.moderators.some((moderator) => moderator.id === user.id)) throw Error('You are not a moderator');

    if (req.body.description.length > 500) throw Error('Topic description is too long');
    if (req.body.headline.length > 100) throw Error('Topic headline is too long');

    topic.description = req.body.description;
    topic.headline = req.body.headline;

    await topic.save();

    res.status(200).json({
      topic: { description: topic.description, headline: topic.headline },
      status: { text: 'Successfully updated topic', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

export const ModerationRouter = router;
