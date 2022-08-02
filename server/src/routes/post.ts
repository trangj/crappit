import express from 'express';
import sanitizeHtml from 'sanitize-html';
import { upload, deleteFile } from '../middleware/upload';
import { auth, optionalAuth } from '../middleware/auth';
import {
  Post, Topic, User, Vote,
} from '../entities';
import AppDataSource from '../dataSource';

const router = express.Router();

// @route   GET /api/post/:id
// @desc    Get a post
// @access  Public

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await AppDataSource.query(`
      select
      p.*,
      t.title topic,
      t.icon_image_url icon_image_url,
      t.icon_image_name icon_image_name,
      u.username author,
      v.value user_vote
      from post p
      inner join topic t on p.topic_id = t.id
      inner join "user" u on p.author_id = u.id
      left join vote v on p.id = v.post_id and v.user_id = $1
      where p.id = $2
    `, [req.user.id, req.params.id]);
    if (!post[0]) throw Error('Post does not exist');

    res.status(200).json({ post: post[0] });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

// @route   POST /api/post
// @desc    Create post
// @access  Private

router.post('/', auth, upload, async (req, res) => {
  try {
    const topic = await AppDataSource.manager.findOne(
      Topic,
      { where: { title: req.body.topic } },
    );
    if (!topic) throw Error('No topic exists');

    if (req.body.title.length > 300) throw Error('Post title is too long');

    const newPost = AppDataSource.manager.create(
      Post,
      {
        title: req.body.title,
        type: req.body.type,
        content: sanitizeHtml(req.body.content),
        image_url: req.file && req.body.type === 'photo' ? req.file.location : '',
        image_name: req.file && req.body.type === 'photo' ? req.file.key : '',
        author_id: req.user.id,
        topic,
      },
    );

    await newPost.save();

    res.status(200).json({
      post: { id: newPost.id, topic: newPost.topic.title },
      status: { text: 'Post successfully created', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   DELETE /api/post/:id
// @desc    Delete a post
// @access  Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await AppDataSource.manager.findOne(
      Post,
      { where: { id: parseInt(req.params.id), author_id: req.user.id } },
    );
    if (!post) throw Error('Post does not exist or you are not the author');

    await post.remove();
    if (post.type === 'photo') deleteFile(post.image_name);

    res.status(200).json({
      status: { text: 'Post successfully deleted', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   PUT /api/post/:id
// @desc    Update a post
// @access  Private

router.put('/:id', auth, async (req, res) => {
  try {
    const post = await AppDataSource.manager.findOne(
      Post,
      { where: { id: parseInt(req.params.id), author_id: req.user.id } },
    );
    if (!post) throw Error('Post does not exist or you are not the author of the post');
    if (post.type !== 'text') throw Error('You can only edit text posts');

    if (!req.body.content) throw Error('Missing required fields');
    post.content = sanitizeHtml(req.body.content);

    await post.save();

    res.status(200).json({
      post: { content: post.content },
      status: { text: 'Post successfully updated', severity: 'success' },
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: 'error' } });
  }
});

// @route   PUT /api/post/:id/changevote
// @desc    Change vote on post
// @access  Private

router.put('/:id/changevote', auth, async (req, res) => {
  try {
    const post = await AppDataSource.manager.findOne(
      Post,
      { where: { id: parseInt(req.params.id) } },
    );
    if (!post) throw Error('No post exists');
    const post_author = await AppDataSource.manager.findOne(
      User,
      { where: { id: post.author_id } },
    );
    if (!post_author) throw Error('Post author does not exist');

    const vote = await AppDataSource.manager.findOne(
      Vote,
      { where: { post_id: post.id, user_id: req.user.id } },
    );
    if (!vote) {
      const newVote = AppDataSource.manager.create(
        Vote,
        {
          post,
          user_id: req.user.id,
          value: req.query.vote === 'like' ? 1 : -1,
        },
      );
      post.vote += req.query.vote === 'like' ? 1 : -1;
      post_author.karma += req.query.vote === 'like' ? 1 : -1;

      await AppDataSource.transaction(async (em) => {
        await em.save(newVote);
        await em.save(post);
        await em.save(post_author);
      });

      res.status(200).json({ vote: post.vote, user_vote: newVote.value });
    } else {
      if (req.query.vote === 'like') {
        if (vote.value === 1) {
          // if user likes and already liked post
          vote.value = 0;
          post.vote -= 1;
          post_author.karma -= 1;
        } else if (vote.value === 0) {
          // if user likes an unvoted post
          vote.value = 1;
          post.vote += 1;
          post_author.karma += 1;
        } else {
          // if user likes an already disliked post
          vote.value = 1;
          post.vote += 2;
          post_author.karma += 2;
        }
      } else if (vote.value === -1) {
        // if user dislikes an already disliked post
        vote.value = 0;
        post.vote += 1;
        post_author.karma += 1;
      } else if (vote.value === 0) {
        // if user dislikes an unvoted post
        vote.value = -1;
        post.vote -= 1;
        post_author.karma -= 1;
      } else {
        // if user dislikes an already liked post
        vote.value = -1;
        post.vote -= 2;
        post_author.karma -= 2;
      }

      await AppDataSource.transaction(async (em) => {
        await em.save(vote);
        await em.save(post);
        await em.save(post_author);
      });

      res.status(200).json({ vote: post.vote, user_vote: vote.value });
    }
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: 'error' },
    });
  }
});

export const PostRouter = router;
