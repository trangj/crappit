import express from 'express';
import { optionalAuth } from '../middleware/auth';
import AppDataSource from '../dataSource';

const router = express.Router();

// @route   GET /api/search
// @desc    Get all topics
// @access  Public

router.get('/', optionalAuth, async (req, res) => {
  try {
    const posts = await AppDataSource.query(`
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
      where p.title like $2
      order by
        (case when $3 = 'top' then p.vote end) desc,
        (case when $3 = 'new' then p.created_at end) desc,
        (case when $3 = 'hot' or $3 = '' then p.number_of_comments end) desc
      limit 10 offset $4
    `, [req.user.id, `%${req.query.q}%`, req.query.sort, req.query.skip]);

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

export const SearchRouter = router;
